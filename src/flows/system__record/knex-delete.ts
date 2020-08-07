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
        let knex = this.system.knex.tx(this.schema.type);

        // Add the records to the statement
        this.change.forEach(record => {
            knex.where({ id: record.data.id }).update({
                meta__trashed_at: System.NOW,
                meta__trashed_by: this.system.user.id
            });
        });

        // Run the changes
        await knex;
    }
}
