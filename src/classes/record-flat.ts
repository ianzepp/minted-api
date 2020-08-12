import _ from 'lodash';
import assert from 'assert';

import { Record } from '../classes/record';
import { RecordFlat } from '../typedefs/record';

export class RecordFlatProxy implements RecordFlat {
    constructor(record: Record) {
        return new Proxy(record, {
            get: get,
            set: set,
            enumerate: t => t.keys,
            ownKeys: t => t.keys,
        });
    }
}

function get(record: Record, p: string | number | symbol) {
    if (p === 'toJSON' || p === Symbol.toStringTag) {
        return () => toJSON(record);
    }

    assert(typeof p === 'string', String(p));
    return record.__source_data[p];
}

function set(record: Record, p: string | number | symbol, v: any) {
    assert(typeof p === 'string', String(p));
    record.__source_data[p] = v;
    return true;
}

function toJSON(record: Record) {
    return _.assign({}, record.__source_prev, record.__source_data);
}
