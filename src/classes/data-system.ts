
import { DataDriver } from '../classes/data-driver';
import { DataOp } from '../classes/data-op';
import { Filter } from '../classes/filter';
import { FlowInfo } from '../classes/flow-info';
import { FlowRing } from '../classes/flow-ring';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';

export class DataSystem {
    constructor(private readonly system: System) {

    }

    // Internals
    readonly driver = new DataDriver();


    //
    // Collection methods
    //

    async selectAll(filter: Filter) {
        return [] as Record[];
    }

    async createAll(change: Record[]) {
        return change;
    }

    async updateAll(change: Record[]) {
        return change;
    }

    async upsertAll(change: Record[]) {
        return change;
    }

    async deleteAll(change: Record[]) {
        return change;
    }

    //
    // Individual methods
    //

    async selectOne(filter: Filter) {
        return {} as Record;
    }

    async select404(filter: Filter) {
        return {} as Record;
    }

    async createOne(change: Record) {
        return change;
    }

    async updateOne(change: Record) {
        return change;
    }

    async update404(change: Record) {
        return change;
    }

    async upsertOne(change: Record) {
        return change;
    }

    async deleteOne(change: Record) {
        return change;
    }

    async delete404(change: Record) {
        return change;
    }

    //
    // Primary operation function
    //

    async run(schema: Schema, change: Record[] | undefined, filter: Filter | undefined, op: DataOp) {
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
