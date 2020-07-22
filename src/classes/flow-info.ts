
import { Filter } from '../classes/filter';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { DataOp } from '../classes/data-system';

export enum FlowRing {
    Init,
    Prep,
    Work,
    Post,
    Done,
};

export class FlowInfo<T> {
    constructor(
        readonly schema: Schema<T>,
        readonly change: Record<T>[],
        readonly filter: Filter<T>,
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
