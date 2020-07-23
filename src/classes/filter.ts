import * as _ from 'lodash';

import { Record } from '../classes/record';
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

export class Filter extends Record<FilterData> {
    public readonly where: FilterWhereClause[] = [];
    public readonly order: FilterOrderClause[] = [];
    public limit: number = 0;

    constructor(system: System, schema_name: string, readonly source?: FilterData) {
        super(system, schema_name);
    }
}
