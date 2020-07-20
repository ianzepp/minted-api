import * as _ from 'lodash';

export type RecordName = string;
export type RecordId = string;

export interface RecordData extends _.Dictionary<any> {}

export interface RecordInfo {
    created_at: string,
    created_by: string,
    updated_at: string,
    updated_by: string,
}

export interface RecordMeta {
    schema: string;
}

export interface RecordJson {
    data: RecordData;
    i18n: RecordData;
    info: RecordInfo;
    meta: RecordMeta;
}

export class Record implements RecordJson {
    public data = {};
    public i18n = {};
    public info = {
        created_at: '',
        created_by: '',
        updated_at: '',
        updated_by: ''
    };

    // Meta
    public meta: RecordMeta;

    constructor(schema: string) {
        this.meta = {
            schema: schema
        }
    }
}
