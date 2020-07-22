import * as _ from 'lodash';

import { Flow } from '../classes/flow';
import { FlowInfo, FlowRing } from '../classes/flow-info';
import { FlowLocals } from '../classes/flow-locals';
import { System } from '../system';

export class FlowSystem {
    constructor(private readonly system: System) {}

    /** Executes a single ring cycle */
    async ring<T>(info: FlowInfo<T>, ring: FlowRing) {
        // TODO
    }
}
