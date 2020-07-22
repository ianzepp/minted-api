
import { DataDriver } from '../classes/data-driver';
import { Filter } from '../classes/filter';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { System } from '../system';
import { FlowInfo, FlowRing } from '../classes/flow-info';

export enum DataOp{
    Select = 'select',
    Create = 'create',
    Update = 'update',
    Upsert = 'upsert',
    Delete = 'delete',
};

export class DataSystem {
    constructor(private readonly system: System) {

    }

    // Internals
    readonly driver = new DataDriver();


    //
    // Collection methods
    //

    async selectAll<T>(filter: Filter<T>) {
        return [] as Record<T>[];
    }

    async createAll<T>(change: Record<T>[]) {
        return change;
    }

    async updateAll<T>(change: Record<T>[]) {
        return change;
    }

    async upsertAll<T>(change: Record<T>[]) {
        return change;
    }

    async deleteAll<T>(change: Record<T>[]) {
        return change;
    }

    //
    // Individual methods
    //

    async selectOne<T>(filter: Filter<T>) {
        return {} as Record;
    }

    async select404<T>(filter: Filter<T>) {
        return {} as Record;
    }

    async createOne<T>(change: Record<T>) {
        return change;
    }

    async updateOne<T>(change: Record<T>) {
        return change;
    }

    async update404<T>(change: Record<T>) {
        return change;
    }

    async upsertOne<T>(change: Record<T>) {
        return change;
    }

    async deleteOne<T>(change: Record<T>) {
        return change;
    }

    async delete404<T>(change: Record<T>) {
        return change;
    }

    //
    // Primary operation function
    //

    async run<T>(schema: Schema<T>, change: Record<T>[] | undefined, filter: Filter<T> | undefined, op: DataOp) {
        // Initialize the schema if needed
        await schema.render();

        // Sanity
        change = change ?? [];
        filter = filter ?? schema.toFilter();

        // Build a flow operation
        let info = new FlowInfo<T>(schema, change || [], filter, op);

        // Cycle through the flow steps
        await this.system.flow.ring<T>(info, FlowRing.Init);
        await this.system.flow.ring<T>(info, FlowRing.Prep);
        await this.system.flow.ring<T>(info, FlowRing.Work);
        await this.system.flow.ring<T>(info, FlowRing.Post);
        await this.system.flow.ring<T>(info, FlowRing.Done);

        // Done
        return info.change as Record<T>[];
    }
}
