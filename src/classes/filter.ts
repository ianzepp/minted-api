import * as _ from 'lodash';

export interface FilterJson {};
export type FilterType = Filter | FilterJson;

export class Filter {
    constructor(_filter: FilterJson = {}) {

    }
}
