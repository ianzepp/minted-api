import * as _ from 'lodash';

import { Filter } from '../classes/filter';
import { FilterType } from '../classes/filter';
import { Schema } from '../classes/schema';
import { SchemaType } from '../classes/schema';
import { System } from '../system';

export class MetaSystem {
    constructor(private readonly system: System) {

    }

    toSchema(schema: SchemaType) {
        if (typeof schema === 'string') {
            return new Schema(schema);
        }

        return schema;
    }

    toFilter(filter: FilterType) {
        if (typeof filter === 'string') {
            return new Filter(filter);
        }

        return filter;
    }
}
