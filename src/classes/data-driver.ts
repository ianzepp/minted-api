import * as _ from 'lodash';
import Knex from 'knex';

import { Filter } from '~src/classes/filter';
import { Record } from '~src/classes/record';
import { Schema } from '~src/classes/schema';

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
