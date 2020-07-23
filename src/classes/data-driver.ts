import * as _ from 'lodash';

import { Filter } from '../classes/filter';
import { KnexClient } from '../classes/knex-client';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';

export class DataDriver {
    async select(schema: Schema, filter: Filter) {
        return [] as Record[];
    }

    async create(schema: Schema, change: Record[]) {
        return change;
    }

    async update(schema: Schema, change: Record[]) {
        return change;
    }

    async upsert(schema: Schema, change: Record[]) {
        return change;
    }

    async delete(schema: Schema, change: Record[]) {
        return change;
    }
}
