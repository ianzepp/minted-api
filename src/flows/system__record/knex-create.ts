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

    onCreate() {
        return true;
    }

    async run() {
        // Setup knex, using the current transaction
        let knex = this.system.knex.tx(this.schema.schema_name);

        // Add the records to the statement
        this.change.forEach(record => {
            let native: _.Dictionary<any> = {};

            // Copy data
            _.assign(native, record.diff);

            // Copy info properties
            native.id = this.system.uuid();
            native.created_at = this.system.datetime();
            native.created_by = this.system.user.user_id;
            native.updated_at = this.system.datetime();
            native.updated_by = this.system.user.user_id;

            // TODO - access

            // Add the change
            knex.where({ id: record.info.id }).update(native);
        });

        // Run the change
        await knex;
    }
}
