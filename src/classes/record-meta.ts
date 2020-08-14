import _ from 'lodash';
import assert from 'assert';

import { Record } from '../classes/record';
import { RecordMeta } from '../typedefs/record';

export class RecordMetaProxy implements RecordMeta {
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    trashed_at: string;
    trashed_by: string;

    constructor(record: Record) {
        // @ts-ignore
        return new Proxy(record, {
            get: get,
            set: set,
            has: has,
        });
    }
}

function get(record: Record, p: string | number | symbol) {
    if (p === 'toJSON' || p === Symbol.toStringTag) {
        return () => toJSON(record);
    }

    assert(typeof p === 'string', String(p));
    return record.__source_data['meta__' + p];
}

function set(record: Record, p: string | number | symbol, v: any) {
    assert(typeof p === 'string', String(p));
    record.__source_data['meta__' + p] = v;
    return true;
}

function has(record: Record, p: string | number | symbol) {
    assert(typeof p === 'string', String(p));
    return record.__source_data['meta__' + p] !== undefined;
}

function toJSON(record: Record) {
    return {
        created_at: record.__source_data.meta__created_at || null,
        created_by: record.__source_data.meta__created_by || null,
        updated_at: record.__source_data.meta__updated_at || null,
        updated_by: record.__source_data.meta__updated_by || null,
        trashed_at: record.__source_data.meta__trashed_at || null,
        trashed_by: record.__source_data.meta__trashed_by || null,
    };
}
