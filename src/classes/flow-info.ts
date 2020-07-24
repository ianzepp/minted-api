
import { Filter } from '../classes/filter';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { DataOp } from '../classes/data-op';
import { FlowRing } from '../classes/flow-ring';

export class FlowInfo {
    constructor(
        readonly schema: Schema,
        readonly change: Record[],
        readonly filter: Filter,
        readonly op: DataOp) {}

    get system() {
        return this.schema.system;
    }

    isSelect() {
        return this.op === DataOp.Select;
    }

    isCreate() {
        return this.op === DataOp.Create;
    }

    isUpdate() {
        return this.op === DataOp.Update;
    }

    isUpsert() {
        return this.op === DataOp.Upsert;
    }

    isDelete() {
        return this.op === DataOp.Delete;
    }

    async initialize() {
        // Initialize the schema if needed
        await this.schema.render();

        // nothing else to do right now
    }

    async flow(ring: FlowRing) {
        // TODO
    }
}
