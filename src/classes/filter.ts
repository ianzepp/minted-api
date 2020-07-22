import * as _ from 'lodash';

import { Record } from '../classes/record';
import { System } from '../system';
import { SystemError } from '../system';

export interface FilterData {
    where?: any[],
    order?: any[],
    limit?: number,
}

export class Filter<T> extends Record<T> {
    constructor(system: System, schema_name: string) {
        super(system, schema_name);
    }
}
