import _ from 'lodash';

// API
import { RecordData } from '../typedefs/record';
import { RecordDiff } from '../typedefs/record';
import { RecordI18N } from '../typedefs/record';
import { RecordInfo } from '../typedefs/record';
import { RecordJson } from '../typedefs/record';
import { RecordMeta } from '../typedefs/record';
import { SchemaName } from '../typedefs/schema';
import { SchemaType } from '../typedefs/schema';

// Classes
import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';

export class Record implements RecordInfo {
    private _type: SchemaName;
    private _data: RecordData | undefined = {} as RecordData;
    private _diff: RecordDiff | undefined = {} as RecordDiff;
    private _i18n: RecordI18N | undefined = {} as RecordI18N;
    private _meta: RecordMeta | undefined;

    // Related objects
    constructor(readonly system: System, schema_type: SchemaType, source?: RecordJson | RecordData) {
        // Schema Type is Schema
        if (typeof schema_type === 'string') {
            this._type = schema_type;
        }

        else {
            this._type = schema_type.type;
        }

        // Record Source is missing..
        if (source === undefined) {
            return; // nothing to import
        }

        // Source is Record
        else if (source instanceof Record) {
            this._data = source._data;
            this._meta = source._meta;
        }

        // Source is RecordJson
        else if (_.isPlainObject(source) && source.type && source.data) {
            // TODO
        }

        // Source is T
        else if (_.isPlainObject(source)) {
            // TODO
        }

        // Unknown source data
        else {
            throw new SystemError(500, 'Unknown record source format: %j', source);
        }
    }

    get type(): SchemaName {
        return this._type;
    }

    get data(): RecordData {
        return SystemError.test(this._data, 500, SystemError.UNINITIALIZED);
    }

    get diff(): RecordDiff {
        return SystemError.test(this._diff, 500, SystemError.UNINITIALIZED);
    }

    get i18n(): RecordI18N {
        return SystemError.test(this._i18n, 500, SystemError.UNINITIALIZED);
    }

    get meta(): RecordMeta {
        return SystemError.test(this._meta, 500, SystemError.UNINITIALIZED);
    }

    /** Returns `true` if the internal `data` property has been initialized with actual data */
    isLoaded() {
        return this._data === undefined;
    }

    /** Returns a JSON representation of this record */
    toJSON() {
        return {
            type: this.type,
            data: this.data,
            diff: this.diff,
            i18n: this.i18n,
            meta: this.meta
        };
    }

    /** Accepts `data`/`info` values and stores them internally */
    async inject(data: RecordData, meta: RecordMeta) {
        this._data = data;
        this._diff = {};
        this._i18n = {};
        this._meta = meta;
        return this;
    }

    /** Removes any stores `data` values. Does not remove `info` values (including the record `id`) */
    async unload() {
        this._data = undefined;
        return this;
    }
}
