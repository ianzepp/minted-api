import _ from 'lodash';

import { ColumnData } from '../classes/column-data';
import { Record } from '../classes/record';
import { System } from '../classes/system';

export class Column extends Record<ColumnData> {
    constructor(system: System, readonly schema_name: string, readonly column_name: string) {
        super(system, 'system__column');
    }
}
