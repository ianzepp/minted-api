import Chai from 'chai';

import { SchemaName } from '../typedefs/schema';

export type RecordData = _.Dictionary<any>;
export type RecordFlat = _.Dictionary<any>;
export type UUID = string;

/** Defines the allowable types for database change operations */
export type ChangeData = RecordFlat | RecordData | RecordJson;

export interface RecordMeta {
    /** Timestamp when the record was created */
    created_at: string;

    /** User ID that created the record */
    created_by: UUID;

    /** Timestamp when the record was updated */
    updated_at: string;

    /** User ID who created the record */
    updated_by: UUID;

    /** Timestamp when the record was trashed, or `null` if the record is not trashed */
    trashed_at: string | null;

    /** User ID that trashed the record, or `null` if the record is not trashed */
    trashed_by: UUID | null;
}

export interface RecordAcls {
    full: UUID[];
    edit: UUID[];
    read: UUID[];
    deny: UUID[];
}

export interface RecordJson {
    /** Returns the string name of the parent schema type */
    type: SchemaName;

    /** Accessor to the key/value mapping of record properties with their values */
    data: RecordData;
}

export interface RecordConcreteJson extends RecordJson {
    /** Accessor to the set of timestamp and access information describing this record */
    meta: RecordMeta;

    /** Accessor to the set of access control list data */
    acls: RecordAcls;
}

export interface RecordInfo extends RecordConcreteJson {
    /** Accessor to the previous version of the data (if any) */
    prev: Readonly<RecordData>;

    /** Accessor to the subset of changed data for this record for this operation */
    diff: Readonly<Partial<RecordData>>;

    /** Accessor to the flat version of the data, with all namespaces prefixed */
    flat: RecordFlat;

    /** Returns the set of record property keys (fully qualified) */
    keys: string[];

    /** Returns a JSON representation of this record */
    toJSON(): Readonly<RecordConcreteJson>;

    /** Returns the full flattened record data */
    toFlat(): Readonly<RecordFlat>;

    /** Returns the full flattened record data, but only for changed properties */
    toFlatDiff(): Readonly<Partial<RecordFlat>>;

    /** Start an expectation */
    expect(path?: string): Chai.Assertion;
}
