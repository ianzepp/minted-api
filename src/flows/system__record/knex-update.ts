import _ from 'lodash';

import { Flow } from '../../classes/flow';
import { System } from '../../classes/system';

export default class extends Flow {
    onSchema() {
        return 'system__record';
    }

    onRing() {
        return Flow.RING_WORK;
    }

    onUpdate() {
        return true;
    }

    async run() {
        // Setup knex, using the current transaction
        let knex = this.system.knex.tx(this.schema.name);

        // Loop and process records
        this.change.forEach(record => {
            record.meta.updated_at = System.NOW;
            record.meta.updated_by = this.system.user.id;

            // Add the change
            knex.where({ id: record.data.id }).update(record.toFlatDiff());
        });

        // Run the changes
        await knex;
    }
}
