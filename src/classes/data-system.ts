import _ from 'lodash';

import { ChangeType } from '../classes/change-type';
import { DataOp } from '../classes/data-op';
import { Filter } from '../classes/filter';
import { FlowInfo } from '../classes/flow-info';
import { FlowRing } from '../classes/flow-ring';
import { Record } from '../classes/record';
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

    async createAll(change: ChangeType[]) {
        return this._run_change(change, DataOp.Create);
    }

    async updateAll(change: ChangeType[]) {
        return this._run_change(change, DataOp.Update);
    }

    async upsertAll(change: ChangeType[]) {
        return this._run_change(change, DataOp.Upsert);
    }

    async deleteAll(change: ChangeType[]) {
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

    async createOne(change: ChangeType) {
        return this._run_change(Array(change), DataOp.Create).then(__head_one);
    }

    async updateOne(change: ChangeType) {
        return this._run_change(Array(change), DataOp.Update).then(__head_one);
    }

    async upsertOne(change: ChangeType) {
        return this._run_change(Array(change), DataOp.Upsert).then(__head_one);
    }

    async deleteOne(change: ChangeType) {
        return this._run_change(Array(change), DataOp.Delete).then(__head_one);
    }

    //
    // Filter + Change ops
    //

    async updateAny(_filter: Filter, _change: ChangeType) {
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

    private async _run_change(change: ChangeType[], op: DataOp) {
        let records = change.map(source => this._to_record(source));
        let schemas = _.groupBy(records, record => record.type);

        // Process schema collections in the order they appear
        for(let schema_name in schemas) {
            let schema = this.system.meta.toSchema(schema_name)

            // Run this groups of changes
            await this._run(schema, schemas[schema_name], undefined, op);
        }

        // Done
        return records;
    }

    private async _run(schema: Schema, change: Record[] | undefined, filter: Filter | undefined, op: DataOp) {
        // Sanity
        change = change ?? [];
        filter = filter ?? schema.toFilter();

        // Build a flow operation
        let info = new FlowInfo(schema, change, filter, op);

        // Initialize any missing data
        await info.initialize();

        // Cycle through the flow steps
        await info.flow(FlowRing.Init);
        await info.flow(FlowRing.Prep);
        await info.flow(FlowRing.Work);
        await info.flow(FlowRing.Post);
        await info.flow(FlowRing.Done);

        // Done
        return info.change;
    }

    private _to_record(change: ChangeType) {
        if (change instanceof Record) {
            return change;
        }

        else if (_.isPlainObject(change) === false) {
            throw new SystemError(500, 'Unable to convert non-plain-object data %j to a record instance', change);
        }

        else if (typeof change.type === 'string' && change.data) {
            return this.system.meta.toRecord(change.type, change);
        }

        else {
            throw new SystemError(500, 'Unsupport record data format %j', change);
        }
    }
}
