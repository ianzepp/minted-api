import * as _ from 'lodash';

import { Filter } from '~src/classes/filter';
import { FilterType } from '~src/classes/filter';
import { Schema } from '~src/classes/schema';
import { SchemaName } from '~src/classes/schema';
import { SchemaType } from '~src/classes/schema';
import { System } from '~src/system';

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
