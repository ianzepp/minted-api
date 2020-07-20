
import { Filter } from 'classes/filter';
import { Record } from 'classes/record';
import { Schema } from 'classes/schema';
import { System } from 'system';

export class DataDriver {
    async selectAll(schema: Schema, filter: Filter) {
        return [] as Record[];
    }

    async createAll(schema: Schema, change: Record[]) {
        return change;
    }

    async updateAll(schema: Schema, change: Record[]) {
        return change;
    }

    async upsertAll(schema: Schema, change: Record[]) {
        return change;
    }

    async deleteAll(schema: Schema, change: Record[]) {
        return change;
    }
}
