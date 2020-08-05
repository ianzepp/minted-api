import _ from 'lodash';

// API
import { FilterWhereClause } from '../typedefs/filter';
import { FilterOrderClause } from '../typedefs/filter';
import { FilterJson } from '../typedefs/filter';
import { FilterInfo } from '../typedefs/filter';
import { SchemaName } from '../typedefs/schema';

// Classes
import { Schema } from '../classes/schema';
import { System } from '../classes/system';

export class Filter implements FilterInfo {
    public readonly table: SchemaName;
    public readonly where: FilterWhereClause[] = [];
    public readonly order: FilterOrderClause[] = [];
    public limit: number = 0;

    constructor(readonly system: System, readonly schema: Schema, readonly source: FilterJson = {}) {
        this.table = schema.type;

        // Process source data
        this.where = _.compact(_.flatten([source.where]));
        this.order = _.compact(_.flatten([source.order]));
        this.limit = source.limit || 0;
    }

    toJSON(): FilterJson {
        return {
            table: this.table,
            where: this.where.length ? this.where : undefined,
            order: this.order.length ? this.order : undefined,
            limit: this.limit > 0 ? this.limit : undefined,
        };
    }

    async selectAll() {
        return this.system.data.selectAll(this);
    }

    async selectOne() {
        return this.system.data.selectOne(this);
    }

    async select404() {
        return this.system.data.select404(this);
    }
}
