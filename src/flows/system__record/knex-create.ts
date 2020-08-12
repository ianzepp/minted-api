import _ from 'lodash';
import debug from 'debug';

// Classes
import { Flow } from '../../classes/flow';
import { System } from '../../classes/system';

const logger = debug('minted-api:flow:system__record:knex-create');

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
        let knex = this.system.knex.tx(this.schema.name);

        // Set record properties
        this.change.forEach(record => {
            record.data.id = this.system.uuid();
            record.data.ns = this.system.user.ns;
            record.data.sc = this.system.user.sc || null;

            record.meta.created_at = System.NOW;
            record.meta.created_by = this.system.user.id;
            record.meta.updated_at = System.NOW;
            record.meta.updated_by = this.system.user.id;
            record.meta.trashed_at = null;
            record.meta.trashed_by = null;

            record.acls.full = record.acls.full || [];
            record.acls.edit = record.acls.edit || [];
            record.acls.read = record.acls.read || [];
            record.acls.deny = record.acls.deny || [];

            // Add the change
            knex.insert(record.toFlat());
        });

        // Run the change
        await knex;
    }
}
