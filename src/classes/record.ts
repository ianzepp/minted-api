import * as _ from 'lodash';

import { Schema } from '../classes/schema';
import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';

export interface RecordData extends _.Dictionary<any> {}

export interface RecordInfo {
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

export interface RecordJson {
    data: RecordData;
    info: RecordInfo;
}

export class Record<T extends RecordData = RecordData> implements RecordJson {
    private _schema: Schema | undefined;
    private _data: T | undefined;
    private _info: RecordInfo | undefined;

    constructor(readonly system: System, private readonly _schema_name: string, private readonly _native?: RecordData) {}

    /** Returns either the discovered schema's name, or the name of the schema when it was passed into the constructor */
    get schema_name() {
        return this._schema ? this._schema.schema_name : this._schema_name;
    }

    /** Returns the original "native" data that was used to generate this record */
    get native() {
        return this._native;
    }

    get schema() {
        return this._schema ?? (this._schema = this._to_schema());
    }

    get data(): T {
        return SystemError.test(this._data, 500, SystemError.UNINITIALIZED);
    }

    get info(): RecordInfo {
        return SystemError.test(this._info, 500, SystemError.UNINITIALIZED);
    }

    /** Returns `true` if the internal `data` property has been initialized with actual data */
    isLoaded() {
        return this._data === undefined;
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

    // /** Proxy to `system.data.createOne()` and passes in this record */
    // async create(): Promise<Record<ObjectType>> {
    //     return this.system.data.createOne(this) as unknown as Record<ObjectType>;
    // }
    //
    // /** Proxy to `system.data.updateOne()` and passes in this record */
    // async update(): Promise<Record<ObjectType>> {
    //     return this.system.data.updateOne(this) as unknown as Record<ObjectType>;
    // }
    //
    // /** Proxy to `system.data.deleteOne()` and passes in this record */
    // async delete(): Promise<Record<ObjectType>> {
    //     return this.system.data.deleteOne(this) as unknown as Record<ObjectType>;
    // }

    //
    // Helpers
    //

    private _to_schema() {
        return this.system.meta.define(this._schema_name);
    }
}
