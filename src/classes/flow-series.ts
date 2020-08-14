import _ from 'lodash';

// API
import { FilterInfo } from '../typedefs/filter';
import { FlowInfo } from '../typedefs/flow';
import { FlowRing } from '../typedefs/flow';
import { FlowSeriesInfo } from '../typedefs/flow';
import { RecordInfo } from '../typedefs/record';
import { SchemaInfo } from '../typedefs/schema';

// Classes
import { Flow } from '../classes/flow';
import { System } from '../classes/system';

// Flow files
export const FLOWS: Array<typeof Flow> = [
    require('../flows/system__record/knex-create').default,
    require('../flows/system__record/knex-delete').default,
    require('../flows/system__record/knex-select').default,
    require('../flows/system__record/knex-update').default,
];

// Implementation
export class FlowSeries implements FlowSeriesInfo {
    private _flows: FlowInfo[] | undefined;

    constructor(
        readonly system: System,
        readonly schema: SchemaInfo,
        readonly change: RecordInfo[],
        readonly filter: FilterInfo,
        readonly op: string) {}

    /** Returns the list of flows that apply to this series and schema */
    get flows() {
        return (this._flows = this._flows ?? this._to_flows());
    }

    isSelect() {
        return this.op === 'select';
    }

    isCreate() {
        return this.op === 'create';
    }

    isUpdate() {
        return this.op === 'update';
    }

    isUpsert() {
        return this.op === 'upsert';
    }

    isDelete() {
        return this.op === 'delete';
    }

    onSchema() {
        return this.schema.name;
    }

    async initialize() {

    }

    async run(ring: FlowRing) {
        // Filter down the master flow list to only be the ones for this ring
        let flows = this.flows.filter(flow => flow.onRing() === ring);

        // Walk and run
        for(let flow of flows) {
            await flow.run();
        }

        // Done
    }

    //
    // Helpers
    //

    private _to_flows() {
        return _.compact(FLOWS.map(FlowType => {
            // Create the flow
            let flow = new FlowType(this.system, this);

            // Filter flows by schema type
            if (this.onSchema() !== flow.onSchema() && flow.onSchema() !== 'system__record') {
                return;
            }

            // Filter flows by operation
            if (flow.onSelect() && this.isSelect() === false) {
                return;
            }

            if (flow.onCreate() && this.isCreate() === false) {
                return;
            }

            if (flow.onUpdate() && this.isUpdate() === false) {
                return;
            }

            if (flow.onUpsert() && this.isUpsert() === false) {
                return;
            }

            if (flow.onDelete() && this.isDelete() === false) {
                return;
            }

            // Ok, use it
            return flow as FlowInfo;
        }));
    }
}
