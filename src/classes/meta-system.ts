import * as _ from 'lodash';

import { Schema } from '../classes/schema';
import { System } from '../system';

export class MetaSystem {
    constructor(private readonly system: System) {}

    /** Returns an uninitialized schema reference (which may or may not exist / be visible) */
    define<T>(schema_name: string): Schema<T> {
        return new Schema<T>(this.system, schema_name);
    }

    /** Creates an uninitialized schema, and then initializes it */
    async render<T>(schema_name: string): Promise<Schema<T>> {
        return this.define<T>(schema_name).render();
    }
}
