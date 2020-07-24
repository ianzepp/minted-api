import _ from 'lodash';

import { ChangeType } from '../classes/change-type';
import { FilterData } from '../classes/filter';
import { Schema } from '../classes/schema';
import { SchemaType } from '../classes/schema';
import { System } from '../classes/system';

export class MetaSystem {
    constructor(private readonly system: System) {}

    // Cache known schema names
    private readonly _schema_map: _.Dictionary<Schema> = {};

    /** Initialize a schema, using a local cache if possible */
    toSchema(schema_type: SchemaType) {
        if (schema_type instanceof Schema) {
            return schema_type;
        }

        let schema_map = this._schema_map;
        let schema = schema_map[schema_type];

        if (schema === undefined) {
            schema = new Schema(this.system, schema_type);
            schema_map[schema_type] = schema;
        }

        return schema;
    }

    /** Proxy to `schema.toFilter()` */
    toFilter(schema_type: SchemaType, filter_data?: FilterData) {
        return this.toSchema(schema_type).toFilter(filter_data);
    }

    /** Proxy to `schema.toRecord()` */
    toRecord(schema_type: SchemaType, record_data?: ChangeType) {
        return this.toSchema(schema_type).toRecord(record_data);
    }
}
