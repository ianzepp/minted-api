import _ from 'lodash';
import assert from 'assert';

import { Record } from '../classes/record';
import { RecordData } from '../typedefs/record';

export class RecordDataProxy implements RecordData {
    [index: string]: any;

    constructor(record: Record) {
        return new Proxy(record, {
            get: get,
            set: set,
        });
    }
}

function get(record: Record, p: string | number | symbol) {
    if (p === 'toJSON' || p === Symbol.toStringTag) {
        return () => toJSON(record);
    }

    assert(typeof p === 'string', String(p));
    assert(p.startsWith('acls__') === false, p);
    assert(p.startsWith('meta__') === false, p);

    return record.__source_data[p];
}

function set(record: Record, p: string | number | symbol, v: any) {
    assert(typeof p === 'string', String(p));
    assert(p.startsWith('acls__') === false, p);
    assert(p.startsWith('meta__') === false, p);

    record.__source_data[p] = v;
    return true;
}

function toJSON(record: Record) {
    return _.transform(record.__source_data, (result, v, p) => {
        if (p.startsWith('meta__')) {
            return result;
        }

        if (p.startsWith('acls__')) {
            return result;
        }

        return _.set(result, p, v);
    }, {});
}
