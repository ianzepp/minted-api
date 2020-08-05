import _ from 'lodash';

// Classes
import { Flow } from '../../classes/flow';

/**
 * This flow executes when a schema is created. Once the schema "record" is inserted
 * into the database, then (As part of the post-insert process), the schema will be
 * deployed to the underlying database as a new table.
 *
 * If the table creation fails, then the transaction is rolled back and the original
 * insert is undone.
 */
export default class extends Flow {
    onSchema() {
        return 'system__schema';
    }

    onRing() {
        return Flow.RING_POST;
    }

    onCreate() {
        return true;
    }

    async run() {
        for(let record of this.change) {
            // Create a schema placeholder
            let schema = this.system.meta.toSchema(record.data.name);

            // Add the table data
            await this.system.knex.createTable(schema.type, table => {
                table.text('description');
                table.boolean('metadata');
                table.boolean('frozen');
            });
        }
    }
}
