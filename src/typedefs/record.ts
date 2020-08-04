
export type RecordData = _.Dictionary<any>;
export type RecordDiff = _.Dictionary<any>;
export type RecordI18N = _.Dictionary<any>;

/** Defines the allowable types for database change operations */
export type ChangeData = RecordJson | RecordData;

export interface RecordMeta {
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
    /** Returns the string name of the parent schema type */
    type: string;

    /** Returns the key/value mapping of record properties with their values */
    data: RecordData;
}

export interface RecordConcreteJson extends RecordJson {
    /** Returns the subset of changed data for this record for this operation */
    diff: RecordDiff;

    /** Returns the set of timestamp and access information describing this record */
    meta: RecordMeta;

    /** Returns any translated text values for this record */
    i18n: RecordI18N;
}

export interface RecordInfo extends RecordConcreteJson {
    /** Returns the key/value mapping of record properties with their values */
    data: RecordData;

    /** Returns `true` if the internal `data` property has been initialized with actual data */
    isLoaded(): boolean;

    /** Returns a JSON representation of this record */
    toJSON(): RecordConcreteJson;
}
