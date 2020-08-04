import _ from 'lodash';
import Knex from 'knex';

import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';

// Let the library juggle connections internally
export const KnexDriverOptions: Knex.Config = {
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432
    },
    useNullAsDefault: true
};

export const KnexDriver = Knex(KnexDriverOptions);

export class KnexSystem {
    private _transaction: Knex.Transaction | undefined;

    constructor(private readonly system: System) {}

    /** Returns the internal knex driver. This direct-access approach should be used sparingly. */
    get driver() {
        return KnexDriver;
    }

    /** Gets a new knex builder, using the internal transaction reference */
    tx(using: string) {
        if (this._transaction === undefined) {
            throw new SystemError(500, 'Missing Knex transaction reference!');
        }

        // Attach the transaction reference
        return KnexDriver(using).transacting(this._transaction);
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
}
