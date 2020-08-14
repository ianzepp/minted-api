import _ from 'lodash';

// API
import { ChangeData } from '../typedefs/record';
import { FilterJson } from '../typedefs/filter';
import { FilterInfo } from '../typedefs/filter';
import { RecordInfo } from '../typedefs/record';
import { SchemaInfo } from '../typedefs/schema';
import { SchemaName } from '../typedefs/schema';

// Classes
import { Record } from '../classes/record';
import { Filter } from '../classes/filter';
import { System } from '../classes/system';

export class Schema implements SchemaInfo {
    constructor(private readonly system: System, readonly name: SchemaName) {}

    toFilter(source?: FilterJson): FilterInfo {
        return new Filter(this.system, this.name, source);
    }

    toRecord(source?: ChangeData): RecordInfo {
        return new Record(this.system, this.name, source);
    }

    toChange(source?: ChangeData[]): RecordInfo[] {
        return (source ?? []).map(source => this.toRecord(source));
    }

    async selectAll(filter: FilterJson) {
        return this.system.data.selectAll(this.name, filter);
    }

    async selectOne(filter: FilterJson) {
        return this.system.data.selectOne(this.name, filter);
    }

    async select404(filter: FilterJson) {
        return this.system.data.select404(this.name, filter);
    }

    async createAll(change: ChangeData[]) {
        return this.system.data.createAll(this.name, change);
    }

    async createOne(change: ChangeData) {
        return this.system.data.createOne(this.name, change);
    }

    async updateAll(change: ChangeData[]) {
        return this.system.data.updateAll(this.name, change);
    }

    async updateOne(change: ChangeData) {
        return this.system.data.updateOne(this.name, change);
    }

    async upsertAll(change: ChangeData[]) {
        return this.system.data.upsertAll(this.name, change);
    }

    async upsertOne(change: ChangeData) {
        return this.system.data.upsertOne(this.name, change);
    }

    async deleteAll(change: ChangeData[]) {
        return this.system.data.deleteAll(this.name, change);
    }

    async deleteOne(change: ChangeData) {
        return this.system.data.deleteOne(this.name, change);
    }
}
