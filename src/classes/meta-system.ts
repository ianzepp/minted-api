import * as _ from 'lodash';

import { Schema } from '../classes/schema';
import { System } from '../classes/system';

export class MetaSystem {
    constructor(private readonly system: System) {}

    /** Returns an uninitialized schema reference (which may or may not exist / be visible) */
    define(schema_name: string): Schema {
        return new Schema(this.system, schema_name);
    }

    /** Creates an uninitialized schema, and then initializes it */
    async render(schema_name: string): Promise<Schema> {
        return this.define(schema_name).render();
    }
}
