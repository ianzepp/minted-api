import _ from 'lodash';
import debug from 'debug';
import Chai from 'chai';

// API
import { RecordConcreteJson } from '../typedefs/record';
import { RecordData } from '../typedefs/record';
import { RecordFlat } from '../typedefs/record';
import { RecordInfo } from '../typedefs/record';
import { SchemaName } from '../typedefs/schema';

// Classes
import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';

// Proxies
import { RecordAclsProxy } from '../classes/record-acls';
import { RecordDataProxy } from '../classes/record-data';
import { RecordDiffProxy } from '../classes/record-diff';
import { RecordFlatProxy } from '../classes/record-flat';
import { RecordMetaProxy } from '../classes/record-meta';
import { RecordPrevProxy } from '../classes/record-prev';

// Type sugar for proxy stuff
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
    // Internals
    private readonly _source_data: RecordFlat = {
        id: null,
        ns: null,
        sc: null,
        meta__created_at: null,
        meta__created_by: null,
        meta__updated_at: null,
        meta__updated_by: null,
    };

    private readonly _source_prev: RecordFlat = {
        id: null,
        ns: null,
        sc: null,
        meta__created_at: null,
        meta__created_by: null,
        meta__updated_at: null,
        meta__updated_by: null,
    };

    // Proxies
    readonly acls = new RecordAclsProxy(this);
    readonly data = new RecordDataProxy(this);
    readonly diff = new RecordDiffProxy(this);
    readonly flat = new RecordFlatProxy(this);
    readonly meta = new RecordMetaProxy(this);
    readonly prev = new RecordPrevProxy(this);

    // Related objects
    constructor(readonly system: System, readonly type: SchemaName, source?: Record | RecordConcreteJson | RecordFlat | RecordData) {
        debug('minted-api:record')('constructor(): schema-type=%j source=%j', this.type, source);

        // Import from record
        if (source instanceof Record) {
            this._source_data = source._source_data; // Record->Record copies are shallow
            this._source_prev = source._source_prev;
        }

        else if (isRecordConcreteJson(source)) {
            _.assign(this.data, (<RecordConcreteJson>source).data);
            _.assign(this.meta, (<RecordConcreteJson>source).meta);
            _.assign(this.acls, (<RecordConcreteJson>source).acls);

            // In order to correctly handle `diff` checks, replace previous source data
            this._source_prev = _.assign({}, this._source_data);
        }

        else if (isRecordFlat(source)) {
            _.assign(this.flat, source);
        }

        else if (_.isPlainObject(source)) {
            _.assign(this.data, source);
        }

        else {
            throw new SystemError(500, 'Invalid record source data:', source);
        }
    }

    get keys(): string[] {
        return _.keys(this._source_data);
    }

    toString() {
        return `${this.type}#${this._source_data.id}`;
    }

    toJSON() {
        return JSON.parse(JSON.stringify({
            type: this.type,
            data: this.data,
            meta: this.meta,
            acls: this.acls,
        }));
    }

    toFlat() {
        return _.assign({}, this._source_prev, this._source_data);
    }

    toFlatDiff() {
        return this.toFlat() // TODO implementation
    }

    expect(path?: string) {
        if (path === undefined) {
            return Chai.expect(this);
        }

        else {
            return Chai.expect(this).nested.property(path);
        }
    }

    //
    // HACK - accessors for external proxies
    //

    get __source_data() {
        return this._source_data;
    }

    get __source_prev() {
        return this._source_prev;
    }
}
