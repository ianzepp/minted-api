import _ from 'lodash';

import { Flow } from '../../classes/flow';

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
            let native: _.Dictionary<any> = {};

            // Copy changed data
            _.assign(native, record.diff);

            // Copy info properties
            native.updated_at = this.system.datetime();
            native.updated_by = this.system.user.user_id;

            // Add the change
            knex.where({ id: record.meta.id }).update(native);
        });

        // Run the changes
        await knex;
    }
}
