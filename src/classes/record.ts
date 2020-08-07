import _ from 'lodash';
import assert from 'assert';

// API
import { RecordAcls } from '../typedefs/record';
import { RecordConcreteJson } from '../typedefs/record';
import { RecordData } from '../typedefs/record';
import { RecordDiff } from '../typedefs/record';
import { RecordFlat } from '../typedefs/record';
import { RecordInfo } from '../typedefs/record';
import { RecordMeta } from '../typedefs/record';
import { SchemaName } from '../typedefs/schema';
import { SchemaType } from '../typedefs/schema';

// Classes
import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';

// Type sugar for proxy stuff
type ProxyInput = string | number | symbol;

export function isRecordConcreteJson(something: any) {
    let pass = typeof something === 'object'
            && typeof something.acls === 'object'
            && typeof something.data === 'object'
            && typeof something.meta === 'object'
            && typeof something.type === 'string';

    return pass;
}

export function isRecordFlat(something: any) {
    let pass = typeof something === 'object'
            && typeof something.id === 'string'
            && typeof something.ns === 'string'
            && typeof something.meta__created_by === 'string'
            && typeof something.meta__updated_by === 'string';

    return pass;
}

export class Record implements RecordInfo {
    // Column name definitions
    static Data = {
        ID: 'id',
        NS: 'ns',
        SC: 'sc',
    };

    static Meta = {
        CreatedAt: 'meta__created_at',
        CreatedBy: 'meta__created_by',
        UpdatedAt: 'meta__updated_at',
        UpdatedBy: 'meta__updated_by',
        TrashedAt: 'meta__trashed_at',
        TrashedBy: 'meta__trashed_by',
    };

    static Acls = {
        Full: 'acls__full',
        Edit: 'acls__edit',
        Read: 'acls__read',
        Deny: 'acls__deny',
    };

    // Internals
    private readonly _type: SchemaName;
    private readonly _source_data: RecordFlat = {};
    private readonly _source_prev: RecordFlat = {};

    // Caching for json conversions
    private _json: RecordConcreteJson | undefined;

    // Proxies
    readonly flat = new Proxy({}, {
        get: (_t, p) => this.__get_source(p),
        set: (_t, p, v) => this.__set_source(p, v),
        enumerate: (_t) => this.keys,
        ownKeys: (_t) => this.keys,
        has: (_t, p) => p in this._source_data,
    }) as unknown as RecordData;

    readonly data = new Proxy({}, {
        get: (_t, p) => this.__get_data(p),
        set: (_t, p, v) => this.__set_data(p, v),
        enumerate: (_t) => this.keys,
        ownKeys: (_t) => this.keys,
        has: (_t, p) => p in this._source_data,
    }) as unknown as RecordData;

    readonly prev = new Proxy({}, {
        get: (_t, p) => this.__get_prev(p),
        enumerate: (_t) => this.keys,
        ownKeys: (_t) => this.keys,
        has: (_t, p) => p in this._source_data,
    }) as unknown as RecordData;

    readonly diff = new Proxy({}, {
        get: (_t, p) => this.__get_diff(p),
    }) as unknown as RecordDiff;

    readonly meta = new Proxy({}, {
        get: (_t, p) => this.__get_meta(p),
        set: (_t, p, v) => this.__set_meta(p, v),
    }) as unknown as RecordMeta;

    readonly acls = new Proxy({}, {
        get: (_t, p) => this.__get_acls(p),
        set: (_t, p, v) => this.__set_acls(p, v),
    }) as unknown as RecordAcls;

    // Related objects
    constructor(readonly system: System, schema_type: SchemaType, source?: Record | RecordConcreteJson | RecordFlat | RecordData) {
        // Schema Type is Schema
        if (typeof schema_type === 'string') {
            this._type = schema_type;
        }

        else {
            this._type = schema_type.type;
        }

        // Import from record
        if (source instanceof Record) {
            this._source_data = _.assign({}, this._source_data);
            this._source_prev = _.assign({}, this._source_prev);
        }

        else if (isRecordConcreteJson(source)) {
            _.forIn((<RecordConcreteJson>source).data, (v, p) => this.__set_data(p, v));
            _.forIn((<RecordConcreteJson>source).meta, (v, p) => this.__set_meta(p, v));
            _.forIn((<RecordConcreteJson>source).acls, (v, p) => this.__set_acls(p, v));

            // In order to correctly handle `diff` checks, copy over previous source data
            this._source_prev = _.assign({}, this._source_prev);
        }

        else if (isRecordFlat(source)) {
            this._source_data = _.assign({}, source);
            this._source_prev = _.assign({}, source);
        }

        else if (_.isPlainObject(source)) {
            _.forIn((<RecordConcreteJson>source).data, (v, p) => this.__set_data(p, v));
        }

        else {
            throw new SystemError(500, 'Invalid record source data:', source);
        }
    }

    get type(): SchemaName {
        return this._type;
    }

    get keys(): string[] {
        return _.keys(this._source_data);
    }

    toString() {
        return `${this._type}#${this._source_data.id}`;
    }

    toJSON() {
        return (this._json = this._json ?? this._to_json());
    }

    toFlat() {
        return _.assign({}, this._source_prev, this._source_data);
    }

    //
    // Helpers
    //

    private _to_json() {
        return {
            type: this.type,
            data: this._to_json_data(),
            meta: this._to_json_meta(),
            acls: this._to_json_acls(),
        };
    }

    private _to_json_data(): Readonly<RecordData> {
        return _.transform(this._source_data, (result, v, p) => {
            if (p.startsWith('meta__')) {
                return result;
            }

            if (p.startsWith('acls__')) {
                return result;
            }

            return _.set(result, p, v);
        }, {});
    }

    private _to_json_meta(): Readonly<RecordMeta> {
        return {
            created_at: this._source_data[Record.Meta.CreatedAt],
            created_by: this._source_data[Record.Meta.CreatedBy],
            updated_at: this._source_data[Record.Meta.UpdatedAt],
            updated_by: this._source_data[Record.Meta.UpdatedBy],
            trashed_at: this._source_data[Record.Meta.TrashedAt] || null,
            trashed_by: this._source_data[Record.Meta.TrashedBy] || null,
        };
    }

    private _to_json_acls(): Readonly<RecordAcls> {
        return {
            full: this._source_data[Record.Acls.Full] || [],
            edit: this._source_data[Record.Acls.Edit] || [],
            read: this._source_data[Record.Acls.Read] || [],
            deny: this._source_data[Record.Acls.Deny] || [],
        };
    }

    //
    // Accessors for proxies
    //

    private __get_source(p: ProxyInput) {
        assert(typeof p === 'string');
        assert(p in this._source_data);
        return this._source_data[p] ?? this._source_prev[p];
    }

    private __set_source(p: ProxyInput, v: any) {
        assert(typeof p === 'string');
        assert(p in this._source_data);
        this._source_data[p] = v;
        this._json = undefined;
        return true;
    }

    private __get_data(p: ProxyInput) {
        assert(typeof p === 'string');
        assert.notEqual(p.startsWith('acls__'), true);
        assert.notEqual(p.startsWith('meta__'), true);
        return this.__get_source(p);
    }

    private __set_data(p: ProxyInput, v: any) {
        assert(typeof p === 'string');
        assert.notEqual(p.startsWith('acls__'), true);
        assert.notEqual(p.startsWith('meta__'), true);
        return this.__set_source(p, v);
    }

    private __get_prev(p: ProxyInput) {
        assert(typeof p === 'string');
        assert(p in this._source_prev);
        return this._source_prev[p];
    }

    private __get_diff(p: ProxyInput) {
        assert(typeof p === 'string');
        assert(p in this._source_data);

        let data = this._source_data[p];
        let prev = this._source_prev[p];

        if (prev === undefined) {
            return data;
        }

        if (prev !== data) {
            return data;
        }

        return undefined;
    }

    private __get_meta(p: ProxyInput) {
        assert(typeof p === 'string');
        return this.__get_source('meta__' + p);
    }

    private __set_meta(p: ProxyInput, v: string | Date | null) {
        assert(typeof p === 'string');
        return this.__set_source('meta__' + p, v);
    }

    private __get_acls(p: ProxyInput) {
        assert(typeof p === 'string');
        return this.__get_source('acls__' + p);
    }

    private __set_acls(p: ProxyInput, v: string[]) {
        assert(typeof p === 'string');
        return this.__set_source('acls__' + p, v);
    }
}
