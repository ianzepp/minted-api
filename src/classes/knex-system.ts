import _ from 'lodash';
import Knex from 'knex';

import { System } from '../classes/system';

// Let the library juggle connections internally
export const KnexDriverOptions: Knex.Config = {
    client: 'pg',
    connection: {
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
    },
    useNullAsDefault: true,
    pool: { min: 2, max: 20 },
};

export const KnexDriver = Knex(KnexDriverOptions);

export class KnexSystem {
    private _transaction: Knex.Transaction | undefined;

    constructor(private readonly system: System) {}

    /** Returns the internal knex driver. This direct-access approach should be used sparingly. */
    get driver() {
        return KnexDriver;
    }

    /** Gets a new knex builder, using the internal transaction reference (if any) */
    tx(using: string) {
        if (this._transaction) {
            return KnexDriver(using).transacting(this._transaction);
        }

        else {
            return KnexDriver(using);
        }
    }

    /** Executes a transaction, storing the TX reference for future use */
    async transact(transactFn: () => Promise<any>) {
        return KnexDriver.transaction(tx => {
            // Save the transaction reference
            this._transaction = tx;

            // Execute and return the actual function to execute
            return transactFn();
        }).finally(() => {
            this._transaction = undefined;
        });
    }

    /** Wrapper around the native knex `createTable` function */
    async createTable(schema_name: string, createFn?: (table: Knex.CreateTableBuilder) => void) {
        // Default fn
        if (createFn === undefined) {
            createFn = () => {};
        }

        // Delete any existing table data
        await this.driver.schema.dropTableIfExists(schema_name);

        // Create a new table
        await this.driver.schema.createTable(schema_name, table => {
            // Critical columns
            table.uuid('id').primary();         // global uuid
            table.text('ns').notNullable();     // namespace
            table.text('sc').defaultTo(null);   // security classification

            // Timestamps
            table.dateTime('meta__created_at').notNullable();
            table.uuid('meta__created_by').notNullable();
            table.dateTime('meta__updated_at').notNullable();
            table.uuid('meta__updated_by').notNullable();
            table.dateTime('meta__trashed_at').defaultTo(null);
            table.uuid('meta__trashed_by').defaultTo(null);
            table.dateTime('meta__deleted_at').defaultTo(null);
            table.uuid('meta__deleted_by').defaultTo(null);

            // Access Control Lists
            table.specificType('acls__full', 'uuid[]').defaultTo('{}').notNullable(); // can change acls
            table.specificType('acls__edit', 'uuid[]').defaultTo('{}').notNullable(); // can change data
            table.specificType('acls__read', 'uuid[]').defaultTo('{}').notNullable(); // can select data
            table.specificType('acls__deny', 'uuid[]').defaultTo('{}').notNullable(); // cannot see the record

            // Indexes
            table.index('ns');
            table.index('sc');
            table.index('meta__created_by');

            // Custom table columns
            createFn(table);
        });
    }
}
