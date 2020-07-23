import * as _ from 'lodash';

import { Flow } from '../../classes/flow';
import { FlowRing } from '../../classes/flow-ring';
import { KnexClient } from '../../classes/knex-client';
import { Record } from '../../classes/record';

export class KnexSelect extends Flow {
    onSchema() {
        return '*';
    }

    onRing() {
        return FlowRing.Work;
    }

    onCreate() {
        return true;
    }

    isRunnable() {
        return true; // return this.schema.driver === 'knex';
    }

    async run() {
        // Setup knex, using the current transaction
        let knex = KnexClient(this.schema.schema_name);

        // TODO - transactions

        // Add the records to the statement
        this.change.forEach(record => knex.insert(this._to_native(record)));

        // Run the insert
        await knex;
    }

    private _to_native(record: Record): _.Dictionary<any> {
        return _.merge({}, record.data, record.info);
    }
}
