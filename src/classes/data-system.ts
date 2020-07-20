
import { DataDriver } from '../classes/data-driver';
import { FilterType } from '../classes/filter';
import { Record } from '../classes/record';
import { SchemaType } from '../classes/schema';
import { System } from '../system';

export class DataSystem {
    constructor(private readonly system: System) {

    }

    // Internals
    readonly driver = new DataDriver();

    //
    // Collection methods
    //

    async selectAll(schema: SchemaType, filter: FilterType) {
        return [] as Record[];
    }

    async createAll(schema: SchemaType, change: Record[]) {
        return change;
    }

    async updateAll(schema: SchemaType, change: Record[]) {
        return change;
    }

    async upsertAll(schema: SchemaType, change: Record[]) {
        return change;
    }

    async deleteAll(schema: SchemaType, change: Record[]) {
        return change;
    }

    //
    // Individual methods
    //

    async selectOne(schema: SchemaType, filter: FilterType) {
        return {} as Record;
    }

    async select404(schema: SchemaType, filter: FilterType) {
        return {} as Record;
    }

    async createOne(schema: SchemaType, change: Record) {
        return change;
    }

    async updateOne(schema: SchemaType, change: Record) {
        return change;
    }

    async update404(schema: SchemaType, change: Record) {
        return change;
    }

    async upsertOne(schema: SchemaType, change: Record) {
        return change;
    }

    async deleteOne(schema: SchemaType, change: Record) {
        return change;
    }

    async delete404(schema: SchemaType, change: Record) {
        return change;
    }
}
