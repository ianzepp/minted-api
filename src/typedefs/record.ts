
export type RecordData = _.Dictionary<any>;
export type RecordFlat = _.Dictionary<any>;
export type RecordDiff = Partial<RecordData>;
export type RecordI18N = Partial<RecordData>;

/** Defines the allowable types for database change operations */
export type ChangeData = RecordFlat | RecordData | RecordJson;

export interface RecordMeta {
    /** Timestamp when the record was created */
    created_at: string;

    /** User ID that created the record */
    created_by: string;

    /** Timestamp when the record was updated */
    updated_at: string;

    /** User ID who created the record */
    updated_by: string;

    /** Timestamp when the record was trashed, or `null` if the record is not trashed */
    trashed_at: string | null;

    /** User ID that trashed the record, or `null` if the record is not trashed */
    trashed_by: string | null;
}

export interface RecordAcls {
    full: string[];
    edit: string[];
    read: string[];
    deny: string[];
}

export interface RecordJson {
    /** Returns the string name of the parent schema type */
    type: string;

    /** Returns the key/value mapping of record properties with their values */
    data: RecordData;
}

export interface RecordConcreteJson extends RecordJson {
    /** Returns the set of timestamp and access information describing this record */
    meta: RecordMeta;

    /** Returns the set of access control list data */
    acls: RecordAcls;
}

export interface RecordInfo extends RecordConcreteJson {
    /** Accessor to the previous version of the data (if any) */
    prev: RecordData;

    /** Returns the subset of changed data for this record for this operation */
    diff: RecordDiff;

    /** Accessor to the flat version of the data, with all namespaces prefixed */
    flat: RecordFlat;

    /** Returns the set of record property keys (fully qualified) */
    keys: string[];

    /** Returns a JSON representation of this record */
    toJSON(): RecordConcreteJson;

    /** Returns the full flattened record data */
    toFlat(): RecordFlat;
}
