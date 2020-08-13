import _ from 'lodash';

// Classes
import { Flow } from '../../classes/flow';
import { System } from '../../classes/system';

export default class extends Flow {
    onSchema() {
        return 'system__record';
    }

    onRing() {
        return Flow.RING_WORK;
    }

    onDelete() {
        return true;
    }

    async run() {
        // Setup knex, using the current transaction
        let knex = this.system.knex.tx(this.schema.name);

        // Add the records to the statement
        this.change.forEach(record => {
            // Sanity checks
            record.expect('data.id').a('string');
            record.expect('meta.trashed_at').null;
            record.expect('meta.trashed_by').null;

            // Make updates
            record.meta.trashed_at = System.NOW;
            record.meta.trashed_by = this.system.user.id;

            // Send
            knex.where({ id: record.data.id }).update({
                meta__trashed_at: record.meta.trashed_at,
                meta__trashed_by: record.meta.trashed_by,
            });
        });

        // Run the changes
        await knex;
    }
}
