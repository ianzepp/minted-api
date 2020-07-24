import _ from 'lodash';

import { Flow } from '../../classes/flow';
import { FlowRing } from '../../classes/flow-ring';
import { Schema } from '../../classes/schema';

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
        return FlowRing.Post;
    }

    onCreate() {
        return true;
    }

    async run() {
        // Setup knex, using the current transaction
        let knex = this.system.knex.driver;

        // Convert the schema record into actual knex "createTable" calls
        for(let record of this.change) {
            // Create a schema placeholder
            let schema = this.system.meta.toSchema(record.data.name);

            // Add the table data
            await knex.schema.createTable(schema.qualified_name, table => {
                table.uuid('id').primary();

                // Timestamps
                table.dateTime('created_at').notNullable();
                table.uuid('created_by').notNullable();
                table.dateTime('updated_at').notNullable();
                table.uuid('updated_by').notNullable();
                table.dateTime('trashed_at').defaultTo(null);
                table.uuid('trashed_by').defaultTo(null);
                table.dateTime('deleted_at').defaultTo(null);
                table.uuid('deleted_by').defaultTo(null);

                // Access
                table.jsonb('access_owns').defaultTo(null); // created the record
                table.jsonb('access_full').defaultTo(null); // can change acls
                table.jsonb('access_edit').defaultTo(null); // can change data
                table.jsonb('access_read').defaultTo(null); // can select data
                table.jsonb('access_deny').defaultTo(null); // cannot see the record
            });

            // On to the next record
        }
    }
}
