import _ from 'lodash';

import { Record } from '../classes/record';
import { System } from '../classes/system';

export class Column extends Record {
    constructor(system: System, readonly schema_name: string, readonly column_name: string) {
        super(system, 'system__column');
    }
}
