import * as _ from 'lodash';

import { DataOp } from '../classes/data-op';
import { Filter } from '../classes/filter';
import { FlowInfo } from '../classes/flow-info';
import { FlowRing } from '../classes/flow-ring';
import { Record } from '../classes/record';
import { RecordData } from '../classes/record';
import { Schema } from '../classes/schema';
import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';

function __head_one(result: Record[]): Record | undefined {
    return _.head(result);
}

function __head_404(result: Record[]): Record {
    return SystemError.test404(_.head(result));
}

export class DataSystem {
    constructor(private readonly system: System) {}

    //
    // Collection methods
    //

    async selectAll(filter: Filter) {
        return this._run_select(filter);
    }

    async createAll(change: Record[]) {
        return this._run_change(change, DataOp.Create);
    }

    async updateAll(change: Record[]) {
        return this._run_change(change, DataOp.Update);
    }

    async upsertAll(change: Record[]) {
        return this._run_change(change, DataOp.Upsert);
    }

    async deleteAll(change: Record[]) {
        return this._run_change(change, DataOp.Delete);
    }

    //
    // Individual methods
    //

    async selectOne(filter: Filter): Promise<Record | undefined> {
        return this._run_select(filter).then(__head_one);
    }

    async select404(filter: Filter): Promise<Record> {
        return this._run_select(filter).then(__head_404);
    }

    async createOne(change: Record) {
        return this._run_change(Array(change), DataOp.Create).then(__head_one);
    }

    async updateOne(change: Record) {
        return this._run_change(Array(change), DataOp.Update).then(__head_one);
    }

    async upsertOne(change: Record) {
        return this._run_change(Array(change), DataOp.Upsert).then(__head_one);
    }

    async deleteOne(change: Record) {
        return this._run_change(Array(change), DataOp.Delete).then(__head_one);
    }

    //
    // Filter + Change ops
    //

    async updateAny(_filter: Filter, _change: Record | RecordData) {
        throw new SystemError(500, SystemError.UNIMPLEMENTED);
    }

    async deleteAny(_filter: Filter) {
        throw new SystemError(500, SystemError.UNIMPLEMENTED);
    }

    //
    // Internal functions
    //

    private async _run_select(filter: Filter) {
        return this._run(filter.schema, undefined, filter, DataOp.Select);
    }

    private async _run_change(change: Record[], op: DataOp) {
        let schemas = _.groupBy(change, record => record.schema_name);

        // Process schema collections in the order they appear
        for(let schema_name in schemas) {
            let schema = this.system.meta.define(schema_name);

            // Run this groups of changes
            await this._run(schema, schemas[schema_name], undefined, op);
        }

        // Done, return the original list (which would be modified inline)
        return change;
    }

    private async _run(schema: Schema, change: Record[] | undefined, filter: Filter | undefined, op: DataOp) {
        // Initialize the schema if needed
        await schema.render();

        // Sanity
        change = change ?? [];
        filter = filter ?? schema.toFilter();

        // Build a flow operation
        let info = new FlowInfo(schema, change || [], filter, op);

        // Cycle through the flow steps
        await this.system.flow.ring(info, FlowRing.Init);
        await this.system.flow.ring(info, FlowRing.Prep);
        await this.system.flow.ring(info, FlowRing.Work);
        await this.system.flow.ring(info, FlowRing.Post);
        await this.system.flow.ring(info, FlowRing.Done);

        // Done
        return info.change as Record[];
    }
}
