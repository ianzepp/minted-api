import _ from 'lodash';
import Chai from 'chai';

// API
import { ChangeData } from '../typedefs/record';
import { FilterJson } from '../typedefs/filter';
import { FilterInfo } from '../typedefs/filter';
import { SchemaName } from '../typedefs/schema';
import { RecordInfo } from '../typedefs/record';

// Classes
import { Flow } from '../classes/flow';
import { FlowSeries } from '../classes/flow-series';
import { Record } from '../classes/record';
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

    async selectAll(filter: FilterJson) {
        return this._run_select(filter);
    }

    async createAll(change: ChangeData[]) {
        return this._run_change(change, DataSystem.OP_CREATE);
    }

    async updateAll(change: ChangeData[]) {
        return this._run_change(change, DataSystem.OP_UPDATE);
    }

    async upsertAll(change: ChangeData[]) {
        return this._run_change(change, DataSystem.OP_UPSERT);
    }

    async deleteAll(change: ChangeData[]) {
        return this._run_change(change, DataSystem.OP_DELETE);
    }

    //
    // Individual methods
    //

    async selectOne(filter: FilterJson): Promise<RecordInfo | undefined> {
        return this._run_select(filter).then(__head_one);
    }

    async select404(filter: FilterJson): Promise<RecordInfo> {
        return this._run_select(filter).then(__head_404);
    }

    async createOne(change: ChangeData) {
        return this._run_change(Array(change), DataSystem.OP_CREATE).then(__head_one);
    }

    async updateOne(change: ChangeData) {
        return this._run_change(Array(change), DataSystem.OP_UPDATE).then(__head_one);
    }

    async upsertOne(change: ChangeData) {
        return this._run_change(Array(change), DataSystem.OP_UPSERT).then(__head_one);
    }

    async deleteOne(change: ChangeData) {
        return this._run_change(Array(change), DataSystem.OP_DELETE).then(__head_one);
    }

    //
    // Filter + Change ops
    //

    async updateAny(_filter: FilterJson, _change: ChangeData) {
        throw new SystemError(500, SystemError.UNIMPLEMENTED);
    }

    async deleteAny(_filter: FilterJson) {
        throw new SystemError(500, SystemError.UNIMPLEMENTED);
    }

    //
    // Internal functions
    //

    private async _run_select(filter: FilterJson) {
        Chai.expect(filter, '_run_select(filter)').not.empty;
        Chai.expect(filter, '_run_select(filter)').property('table').not.undefined;

        return this._run(filter.table, undefined, filter, DataSystem.OP_SELECT);
    }

    private async _run_change(change: ChangeData[], op: string) {
        // Group things
        let records = change.map(source => this._to_record(source));
        let schemas = _.groupBy(records, record => record.type);

        // Process schema collections in the order they appear
        for(let schema_name in schemas) {
            let change = schemas[schema_name];

            // Run groups
            await this._run(schema_name, change, undefined, op);
        }

        // Done
        return records;
    }

    private async _run(schema_name: SchemaName, change_data: RecordInfo[] | undefined, filter_data: FilterJson | undefined, op: string) {
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

    private _to_record(change: ChangeData) {
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
            throw new SystemError(500, 'Unsupported record data format %j', change);
        }
    }
}
