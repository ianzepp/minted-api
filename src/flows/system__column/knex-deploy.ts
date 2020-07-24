import * as _ from 'lodash';

import { Flow } from '../../classes/flow';
import { FlowRing } from '../../classes/flow-ring';
import { Column } from '../../classes/column';

export default class extends Flow {
    onSchema() {
        return 'system__column';
    }

    onRing() {
        return FlowRing.Post;
    }

    onCreate() {
        return true;
    }

    async run() {
        // Setup knex, using the current transaction
        let knex = this.system.knex.driver;

        // Convert the column record into actual knex "createTable" calls
        for(let record of this.change) {
            // TODO
        }
    }
}
