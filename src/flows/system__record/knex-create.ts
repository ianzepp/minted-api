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

    onCreate() {
        return true;
    }

    async run() {
        // Setup knex, using the current transaction
        let knex = this.system.knex.tx(this.schema.type);

        // Add the records to the statement
        this.change.forEach(record => {
            let native = record.toFlat();

            // Data
            native.id = this.system.uuid();
            native.ns = this.system.user.ns;
            native.sc = this.system.user.sc || null;

            // Meta
            native.meta__created_at = System.NOW;
            native.meta__created_by = this.system.user.id;
            native.meta__updated_at = System.NOW;
            native.meta__updated_by = this.system.user.id;
            native.meta__trashed_at = null;
            native.meta__trashed_by = null;

            // Acls
            native.acls__full = native.acls__full ?? [];
            native.acls__edit = native.acls__edit ?? [];
            native.acls__read = native.acls__read ?? [];
            native.acls__deny = native.acls__deny ?? [];

            // Add the change
            knex.insert(native);
        });

        // Run the change
        await knex;
    }
}
