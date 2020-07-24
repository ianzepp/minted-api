import _ from 'lodash';

import { Schema } from '../classes/schema';
import { SchemaName } from '../classes/schema';
import { SchemaType } from '../classes/schema';
import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';

export type RecordData = _.Dictionary<any>;

export type RecordInfo = {
    id: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    trashed_at: string | null;
    trashed_by: string | null;
    access_full: string | null;
    access_edit: string | null;
    access_read: string | null;
    access_deny: string | null;
}

export type RecordJson = {
    type: SchemaName;
    data: RecordData;
    info: RecordInfo;
}

export class Record<T extends RecordData = RecordData> implements RecordJson {
    private _type: SchemaName;
    private _data: T | undefined = {} as T;
    private _diff: T | undefined = {} as T;
    private _info: RecordInfo | undefined;

    // Related objects
    constructor(readonly system: System, schema_type: SchemaType, private readonly _source?: Record | RecordJson | T) {
        // Schema Type is Schema
        if (schema_type instanceof Schema) {
            this._type = schema_type.qualified_name;
        }

        else {
            this._type = schema_type;
        }

        // Record Source is missing..
        if (_source === undefined) {
            return; // nothing to import
        }

        // Source is Record
        else if (_source instanceof Record) {
            this._data = _source._data as T;
            this._info = _source._info;
        }

        // Source is RecordJson
        else if (_.isPlainObject(_source) && _source.type && _source.data) {
            // TODO
        }

        // Source is T
        else if (_.isPlainObject(_source)) {
            // TODO
        }

        // Unknown source data
        else {
            throw new SystemError(500, 'Unknown record source format: %j', _source);
        }
    }

    get type(): SchemaName {
        return this._type;
    }

    get data(): T {
        return SystemError.test(this._data, 500, SystemError.UNINITIALIZED);
    }

    get diff(): T {
        return SystemError.test(this._diff, 500, SystemError.UNINITIALIZED);
    }

    get info(): RecordInfo {
        return SystemError.test(this._info, 500, SystemError.UNINITIALIZED);
    }

    /** Returns the original source data that was used to generate this record */
    get source() {
        return this._source;
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
            info: this.info
        };
    }

    /** Accepts `data`/`info` values and stores them internally */
    async inject(data: T, info: RecordInfo) {
        this._data = data;
        this._info = info;
        return this;
    }

    /** Removes any stores `data` values. Does not remove `info` values (including the record `id`) */
    async unload() {
        this._data = undefined;
        return this;
    }
}
