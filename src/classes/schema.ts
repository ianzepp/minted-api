import _ from 'lodash';

// API
import { ChangeData } from '../typedefs/record';
import { FilterData } from '../typedefs/filter';
import { FilterInfo } from '../typedefs/filter';
import { RecordInfo } from '../typedefs/record';
import { SchemaInfo } from '../typedefs/schema';
import { SchemaName } from '../typedefs/schema';

// Classes
import { Record } from '../classes/record';
import { Filter } from '../classes/filter';
import { System } from '../classes/system';

export class Schema extends Record implements SchemaInfo {
    constructor(system: System, schema_name: SchemaName) {
        super(system, 'system__schema', {
            name: schema_name,
            description: null
        });
    }

    toFilter(source?: FilterData): FilterInfo {
        return new Filter(this.system, this, source);
    }

    toRecord(source?: ChangeData): RecordInfo {
        return new Record(this.system, this, source);
    }

    async selectAll(filter: Filter) {
        return this.system.data.selectAll(filter);
    }

    async selectOne(filter: Filter) {
        return this.system.data.selectOne(filter);
    }

    async select404(filter: Filter) {
        return this.system.data.select404(filter);
    }

    async createAll(change: ChangeData[]) {
        return this.system.data.createAll(change);
    }

    async createOne(change: ChangeData) {
        return this.system.data.createOne(change);
    }

    async updateAll(change: ChangeData[]) {
        return this.system.data.updateAll(change);
    }

    async updateOne(change: ChangeData) {
        return this.system.data.updateOne(change);
    }

    async upsertAll(change: ChangeData[]) {
        return this.system.data.upsertAll(change);
    }

    async upsertOne(change: ChangeData) {
        return this.system.data.upsertOne(change);
    }

    async deleteAll(change: ChangeData[]) {
        return this.system.data.deleteAll(change);
    }

    async deleteOne(change: ChangeData) {
        return this.system.data.deleteOne(change);
    }
}
