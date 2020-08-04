import _ from 'lodash';

// Classes
import { Flow } from '../../classes/flow';

export default class extends Flow {
    onSchema() {
        return '*';
    }

    onRing() {
        return Flow.RING_WORK;
    }

    onSelect() {
        return true;
    }

    async run() {
        let knex = this.system.knex.tx(this.schema.type);

        // Find all results, per the filter criteria
        let rows = await knex;

        // Convert to records
        this.change.length = 0;
        this.change.push(... rows.map(native => this.schema.toRecord(native)));
    }
}
