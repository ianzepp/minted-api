import * as _ from 'lodash';

import { Schema } from '../classes/schema';
import { System } from '../system';
import { SystemError } from '../system';

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
export interface RecordJson<T> {
    data: T;
    info: RecordInfo;
}

export class Record<T extends RecordData = RecordData> implements RecordJson<T> {
    private _schema: Schema<T> | undefined;
    private _data: T | undefined;
    private _info: RecordInfo | undefined;

    constructor(readonly system: System, private readonly _schema_name: string, private readonly _record_id?: string) {}

    get schema_name() {
        return this._schema_name;
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

    /** Proxy to `system.data.createOne()` and passes in this record */
    async create() {
        return this.system.data.createOne<T>(this);
    }

    /** Proxy to `system.data.updateOne()` and passes in this record */
    async update() {
        return this.system.data.updateOne<T>(this);
    }

    /** Proxy to `system.data.deleteOne()` and passes in this record */
    async delete() {
        return this.system.data.deleteOne<T>(this);
    }

    //
    // Helpers
    //

    private _to_schema() {
        return this.system.meta.define<T>(this._schema_name);
    }
}
