import _ from 'lodash';

import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { SchemaName } from '../classes/schema';
import { SchemaType } from '../classes/schema';
import { System } from '../classes/system';

export type FilterOp = '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte' | '$like' | '$nlike';

export type FilterData = {
    where?: Array<FilterWhereClause>,
    order?: Array<FilterOrderClause>,
    limit?: number,
}

export type FilterWhereClause = {
    [index: string]: FilterWhereCriteria | {
        [key in FilterOp]?: FilterWhereCriteria
    };
}

export type FilterWhereCriteria = string | boolean | number | null;

export type FilterOrderClause = {
    [index: string]: 'asc' | 'desc';
}

export class Filter {
    public readonly where: FilterWhereClause[] = [];
    public readonly order: FilterOrderClause[] = [];
    public limit: number = 0;

    constructor(readonly system: System, readonly schema: Schema, readonly source?: FilterData) {

    }

    /** Proxy to `system.data.selectAll()` */
    async selectAll() {
        return this.system.data.selectAll(this);
    }

    /** Proxy to `system.data.selectOne()` */
    async selectOne() {
        return this.system.data.selectOne(this);
    }

    /** Proxy to `system.data.select404()` */
    async select404() {
        return this.system.data.select404(this);
    }
}
