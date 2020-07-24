import _ from 'lodash';

import { Flow } from '../../classes/flow';
import { FlowRing } from '../../classes/flow-ring';

export default class extends Flow {
    onSchema() {
        return '*';
    }

    onRing() {
        return FlowRing.Work;
    }

    onDelete() {
        return true;
    }

    async run() {
        // Setup knex, using the current transaction
        let knex = this.system.knex.tx(this.schema.qualified_name);

        // Add the records to the statement
        this.change.forEach(record => {
            let native: _.Dictionary<any> = {};

            // Copy info properties
            native.deleted_at = this.system.datetime();
            native.deleted_by = this.system.user.user_id;

            // Add the change - API deletes are database updates
            knex.where({ id: record.info.id }).update(native);
        });

        // Run the changes
        await knex;
    }
}
