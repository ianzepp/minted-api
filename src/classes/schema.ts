import _ from 'lodash';

import { Filter } from '../classes/filter';
import { FilterData } from '../classes/filter';
import { Record } from '../classes/record';
import { ChangeType } from '../classes/change-type';
import { RecordData } from '../classes/record';
import { RecordJson } from '../classes/record';
import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';

export type SchemaName = string;
export type SchemaType = Schema | SchemaName;

export interface SchemaData extends RecordData {
    name: string;
    description: string | null;
}

export class Schema extends Record<SchemaData> {
    constructor(system: System, schema_name: SchemaName) {
        super(system, 'system__schema', {
            name: schema_name,
            description: null
        });
    }

    get qualified_name() {
        return this.data.name;
    }

    async render() {
        throw new SystemError(500, SystemError.UNIMPLEMENTED);
    }

    /** Generate a new filter */
    toFilter(source?: FilterData) {
        return new Filter(this.system, this, source);
    }

    /** Generate a new record */
    toRecord(source?: RecordJson | RecordData) {
        return new Record(this.system, this, source);
    }

    /** Proxy to `system.data.selectAll()` */
    async selectAll(filter: Filter) {
        return this.system.data.selectAll(filter);
    }

    /** Proxy to `system.data.selectOne()` */
    async selectOne(filter: Filter) {
        return this.system.data.selectOne(filter);
    }

    /** Proxy to `system.data.select404()` */
    async select404(filter: Filter) {
        return this.system.data.select404(filter);
    }

    /** Proxy to `system.data.createAll()` */
    async createAll(change: ChangeType[]) {
        return this.system.data.createAll(change);
    }

    /** Proxy to `system.data.createOne()` */
    async createOne(change: ChangeType) {
        return this.system.data.createOne(change);
    }

    /** Proxy to `system.data.updateAll()` */
    async updateAll(change: ChangeType[]) {
        return this.system.data.updateAll(change);
    }

    /** Proxy to `system.data.updateOne()` */
    async updateOne(change: ChangeType) {
        return this.system.data.updateOne(change);
    }

    /** Proxy to `system.data.upsertAll()` */
    async upsertAll(change: ChangeType[]) {
        return this.system.data.upsertAll(change);
    }

    /** Proxy to `system.data.upsertOne()` */
    async upsertOne(change: ChangeType) {
        return this.system.data.upsertOne(change);
    }

    /** Proxy to `system.data.deleteAll()` */
    async deleteAll(change: ChangeType[]) {
        return this.system.data.deleteAll(change);
    }

    /** Proxy to `system.data.deleteOne()` */
    async deleteOne(change: ChangeType) {
        return this.system.data.deleteOne(change);
    }
}
