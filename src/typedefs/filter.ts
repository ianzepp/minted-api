
import { RecordInfo } from '../typedefs/record';
import { SchemaInfo } from '../typedefs/schema';

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

export interface FilterJson {
    where?: FilterWhereClause[];
    order?: FilterOrderClause[];
    limit?: number;
}

export interface FilterConcreteJson extends FilterJson {
    where: FilterWhereClause[];
    order: FilterOrderClause[];
    limit: number;
}

export interface FilterInfo extends FilterJson {
    /** Returns the parent schema for this filter */
    readonly schema: SchemaInfo;

    /** Proxy to `system.data.selectAll()` */
    selectAll(): Promise<RecordInfo[]>;

    /** Proxy to `system.data.selectOne()` */
    selectOne(): Promise<RecordInfo | undefined>;

    /** Proxy to `system.data.select404()` */
    select404(): Promise<RecordInfo>;
}
