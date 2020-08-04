import _ from 'lodash';

// API
import { ChangeData } from '../typedefs/record';
import { FilterInfo } from '../typedefs/filter';
import { FilterJson } from '../typedefs/filter';
import { RecordInfo } from '../typedefs/record';
import { SchemaInfo } from '../typedefs/schema';
import { SchemaName } from '../typedefs/schema';
import { SchemaType } from '../typedefs/schema';

// Classes
import { Schema } from '../classes/schema';
import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';

export class MetaSystem {
    constructor(private readonly system: System) {}

    // Cache known schema names
    private readonly _schema_dict: _.Dictionary<SchemaInfo> = {};

    /** Initialize a schema, using a local cache if possible */
    toSchema(schema_type: SchemaType): SchemaInfo {
        if (schema_type instanceof Schema) {
            return schema_type as SchemaInfo;
        }

        if (typeof schema_type === 'string') {
            return this._render_schema(schema_type);
        }

        throw new SystemError(500, 'Unable to resolve schema type: %j', schema_type);
    }

    /** Proxy to `schema.toFilter()` */
    toFilter(schema_type: SchemaType, filter_data?: FilterJson): FilterInfo {
        return this.toSchema(schema_type).toFilter(filter_data);
    }

    /** Proxy to `schema.toRecord()` */
    toRecord(schema_type: SchemaType, record_data?: ChangeData): RecordInfo {
        return this.toSchema(schema_type).toRecord(record_data);
    }

    //
    // Helpers
    //

    private _render_schema(schema_name: SchemaName) {
        let schema_dict = this._schema_dict;
        let schema = schema_dict[schema_name] || undefined;

        if (schema === undefined) {
            schema = new Schema(this.system, schema_name);
            schema_dict[schema_name] = schema;
        }

        return schema;
    }
}
