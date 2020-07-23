import * as _ from 'lodash';

import { Flow } from '../classes/flow';
import { FlowInfo } from '../classes/flow-info';
import { FlowRing } from '../classes/flow-ring';
import { System } from '../classes/system';

export class FlowSystem {
    constructor(private readonly system: System) {}

    /** Executes a single ring cycle */
    async ring(info: FlowInfo, ring: FlowRing) {
        // TODO
    }
}
