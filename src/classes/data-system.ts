import _ from 'lodash';

// API
import { ChangeData } from '../typedefs/record';
import { FilterJson } from '../typedefs/filter';
import { SchemaName } from '../typedefs/schema';
import { RecordInfo } from '../typedefs/record';

// Classes
import { Flow } from '../classes/flow';
import { FlowSeries } from '../classes/flow-series';
import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';

function __head_one(result: RecordInfo[]): RecordInfo | undefined {
    return _.head(result);
}

function __head_404(result: RecordInfo[]): RecordInfo {
    return SystemError.test404(_.head(result));
}

export class DataSystem {
    static readonly OP_SELECT = 'select';
    static readonly OP_CREATE = 'create';
    static readonly OP_UPDATE = 'update';
    static readonly OP_UPSERT = 'upsert';
    static readonly OP_DELETE = 'delete';

    constructor(private readonly system: System) {}

    //
    // Collection methods
    //

    async selectAll(schema_name: SchemaName, filter_data: FilterJson) {
        return this._run(schema_name, [], filter_data, DataSystem.OP_SELECT);
    }

    async createAll(schema_name: SchemaName, change_data: ChangeData[]) {
        return this._run(schema_name, change_data, {}, DataSystem.OP_CREATE);
    }

    async updateAll(schema_name: SchemaName, change_data: ChangeData[]) {
        return this._run(schema_name, change_data, {}, DataSystem.OP_UPDATE);
    }

    async upsertAll(schema_name: SchemaName, change_data: ChangeData[]) {
        return this._run(schema_name, change_data, {}, DataSystem.OP_UPSERT);
    }

    async deleteAll(schema_name: SchemaName, change_data: ChangeData[]) {
        return this._run(schema_name, change_data, {}, DataSystem.OP_DELETE);
    }

    //
    // Individual methods
    //

    async selectOne(schema_name: SchemaName, filter_data: FilterJson): Promise<RecordInfo | undefined> {
        return this.selectAll(schema_name, filter_data).then(__head_one);
    }

    async select404(schema_name: SchemaName, change_data: FilterJson): Promise<RecordInfo> {
        return this.selectAll(schema_name, change_data).then(__head_404);
    }

    async selectIds(schema_name: SchemaName, filter_data: string[]): Promise<RecordInfo[]> {
        return this.selectAll(schema_name, {
            where: { id: { $in: filter_data } }
        });
    }

    async createOne(schema_name: SchemaName, change_data: ChangeData) {
        return this.createAll(schema_name, Array(change_data)).then(__head_one);
    }

    async updateOne(schema_name: SchemaName, change_data: ChangeData) {
        return this.updateAll(schema_name, Array(change_data)).then(__head_one);
    }

    async upsertOne(schema_name: SchemaName, change_data: ChangeData) {
        return this.upsertAll(schema_name, Array(change_data)).then(__head_one);
    }

    async deleteOne(schema_name: SchemaName, change_data: ChangeData) {
        return this.deleteAll(schema_name, Array(change_data)).then(__head_one);
    }

    //
    // Filter + Change ops
    //

    async updateAny(_schema_name: SchemaName, _filter_data: FilterJson, _change_data: ChangeData) {
        throw new SystemError(500, SystemError.UNIMPLEMENTED);
    }

    async deleteAny(_schema_name: SchemaName, _filter_data: FilterJson) {
        throw new SystemError(500, SystemError.UNIMPLEMENTED);
    }

    //
    // Internal functions
    //

    private async _run(schema_name: SchemaName, change_data: ChangeData[], filter_data: FilterJson, op: string) {
        let schema = this.system.meta.toSchema(schema_name);
        let filter = schema.toFilter(filter_data);
        let change = schema.toChange(change_data);

        // Build a flow operation
        let series = new FlowSeries(this.system, schema, change, filter, op);

        // Initialize any missing data
        await series.initialize();

        // Cycle through the flow series rings
        await series.run(Flow.RING_INIT);
        await series.run(Flow.RING_PREP);
        await series.run(Flow.RING_WORK);
        await series.run(Flow.RING_POST);
        await series.run(Flow.RING_DONE);

        // Done
        return series.change;
    }
}
