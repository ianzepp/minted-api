import * as _ from 'lodash';

import { Record } from '../classes/record';
import { System } from '../classes/system';

export interface FilterData {
    where?: any[],
    order?: any[],
    limit?: number,
}

export class Filter extends Record {
    constructor(system: System, schema_name: string) {
        super(system, schema_name);
    }
}
