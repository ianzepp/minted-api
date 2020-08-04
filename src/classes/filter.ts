import _ from 'lodash';

// API
import { FilterWhereClause } from '../typedefs/filter';
import { FilterOrderClause } from '../typedefs/filter';
import { FilterData } from '../typedefs/filter';
import { FilterInfo } from '../typedefs/filter';

// Classes
import { Schema } from '../classes/schema';
import { System } from '../classes/system';

export class Filter implements FilterInfo {
    public readonly where: FilterWhereClause[] = [];
    public readonly order: FilterOrderClause[] = [];
    public limit: number = 0;

    constructor(readonly system: System, readonly schema: Schema, readonly source?: FilterData) {

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
