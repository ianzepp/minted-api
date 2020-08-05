import _ from 'lodash';

import { Flow } from '../../classes/flow';

export default class extends Flow {
    onSchema() {
        return 'system__column';
    }

    onRing() {
        return Flow.RING_POST;
    }

    onCreate() {
        return true;
    }

    async run() {

    }
}
