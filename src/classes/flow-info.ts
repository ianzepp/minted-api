
import { Filter } from '../classes/filter';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { DataOp } from '../classes/data-op';

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
}
