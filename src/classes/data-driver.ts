import * as _ from 'lodash';

import { Filter } from '../classes/filter';
import { KnexClient } from '../classes/knex-client';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';

export class DataDriver {
    async select<T>(schema: Schema<T>, filter: Filter<T>) {
        return [] as Record<T>[];
    }

    async create<T>(schema: Schema<T>, change: Record<T>[]) {
        return change;
    }

    async update<T>(schema: Schema<T>, change: Record<T>[]) {
        return change;
    }

    async upsert<T>(schema: Schema<T>, change: Record<T>[]) {
        return change;
    }

    async delete<T>(schema: Schema<T>, change: Record<T>[]) {
        return change;
    }
}
