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

    onSelect() {
        return true;
    }

    async run() {
        let knex = this.system.knex.tx(this.schema.qualified_name);

        // Find all results, per the filter criteria
        let rows = await knex;

        // Convert to records
        this.change.length = 0;
        this.change.push(... rows.map(native => this.schema.toRecord(native)));
    }
}
