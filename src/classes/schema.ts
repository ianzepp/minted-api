import * as _ from 'lodash';

import { Filter } from '../classes/filter';
import { Record } from '../classes/record';
import { RecordData } from '../classes/record';
import { System } from '../system';
import { SystemError } from '../system';

export interface SchemaData {
    name: string;
    description: string | null;
}

export class Schema<T> extends Record<SchemaData> {
    constructor(system: System, schema_name: string) {
        super(system, schema_name);
    }

    /** PLACEHOLDER: Generates the internal data/info structures */
    async render() {
        if (this.isLoaded() === false) {
            // PLACEHOLDER
            let data = { name: this.schema_name, description: null };
            let info = this.system.info();
            await super.inject(data, info);
        }

        return this;
    }

    /** Generate a new filter */
    toFilter() {
        return new Filter<T>(this.system, this.schema_name);
    }

    /** Proxy to `system.data.selectAll()` */
    async selectAll(filter: Filter<T>) {
        return this.system.data.selectAll<T>(filter);
    }

    /** Proxy to `system.data.selectOne()` */
    async selectOne(filter: Filter<T>) {
        return this.system.data.selectOne<T>(filter);
    }

    /** Proxy to `system.data.select404()` */
    async select404(filter: Filter<T>) {
        return this.system.data.select404<T>(filter);
    }
}
