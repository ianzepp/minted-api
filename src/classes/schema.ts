import * as _ from 'lodash';

export type SchemaName = string;
export type SchemaId = string;
export type SchemaType = SchemaName | Schema;

export interface SchemaData {
    name: string;
    description: string | null;
}

export class Schema {
    readonly data: SchemaData;

    constructor(schema_name: SchemaName) {
        this.data = {
            name: schema_name,
            description: null
        }
    }
}
