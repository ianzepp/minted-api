import * as _ from 'lodash';

import { Filter } from '../classes/filter';
import { FilterData } from '../classes/filter';
import { Record } from '../classes/record';
import { RecordData } from '../classes/record';
import { System } from '../classes/system';

export interface SchemaData extends RecordData {
    name: string;
    description: string | null;
}

export class Schema extends Record<SchemaData> {
    constructor(system: System, readonly schema_name: string) {
        super(system, 'system__schema');
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
    toFilter(source?: FilterData) {
        return new Filter(this.system, this.schema_name, source);
    }

    /** Proxy to `system.data.selectAll()` */
    async selectAll(filter: Filter) {
        return this.system.data.selectAll(filter);
    }

    /** Proxy to `system.data.selectOne()` */
    async selectOne(filter: Filter) {
        return this.system.data.selectOne(filter);
    }

    /** Proxy to `system.data.select404()` */
    async select404(filter: Filter) {
        return this.system.data.select404(filter);
    }
}
