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
import { SystemError } from '../classes/system-error';

export class Filter implements FilterInfo {
    public readonly using: SchemaName;
    public readonly where: FilterWhereClause[] = [];
    public readonly order: FilterOrderClause[] = [];
    public limit: number = 0;

    constructor(readonly system: System, readonly schema: Schema, readonly source: FilterJson = {}) {
        this.using = schema.type;

        // source.where
        if (source.where === undefined) {
            // do nothing
        }

        else if (_.isArray(source.where)) {
            this.where.push(... source.where);
        }

        else if (_.isPlainObject(source.where)) {
            this.where.push(source.where);
        }

        else {
            throw new SystemError(500, SystemError.UNSUPPORTED_DATA_TYPE, 'where', source);
        }

        // source.order
        if (source.order === undefined) {
            // do nothing
        }

        else if (_.isArray(source.order)) {
            this.order.push(... source.order);
        }

        else if (_.isPlainObject(source.order)) {
            this.order.push(source.order);
        }

        else {
            throw new SystemError(500, SystemError.UNSUPPORTED_DATA_TYPE, 'order', source);
        }

        // source.limit
        if (source.limit === undefined) {

        }

        else if (source.limit === 'max') {
            this.limit = 10000;
        }

        else if (_.isNumber(source.limit)) {
            this.limit = source.limit || 0;
        }

        else {
            throw new SystemError(500, SystemError.UNSUPPORTED_DATA_TYPE, 'limit', source);
        }
    }

    toJSON(): FilterJson {
        return {
            using: this.using,
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
