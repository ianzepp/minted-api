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
        let knex = this.system.knex.tx(this.schema.type);

        // Add the records to the statement
        this.change.forEach(record => {
            let native = record.toFlat();

            // Copy info properties
            native.meta__updated_at = System.NOW;
            native.meta__updated_by = this.system.user.id;

            // Add the change
            knex.where({ id: native.id }).update(native);
        });

        // Run the changes
        await knex;
    }
}
