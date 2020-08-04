

// API
import { FilterInfo } from '../typedefs/filter';
import { FlowRing } from '../typedefs/flow';
import { FlowSeriesInfo } from '../typedefs/flow';
import { RecordInfo } from '../typedefs/record';
import { SchemaInfo } from '../typedefs/schema';

// Classes
import { System } from '../classes/system';

export class FlowSeries implements FlowSeriesInfo {
    constructor(
        readonly system: System,
        readonly schema: SchemaInfo,
        readonly change: RecordInfo[],
        readonly filter: FilterInfo,
        readonly op: string) {}

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

    async initialize() {
        // nothing else to do right now
    }

    async run(ring: FlowRing) {
        // TODO
    }
}
