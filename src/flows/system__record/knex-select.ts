import _ from 'lodash';

// API
import { ChangeData } from '../../typedefs/record';

// Classes
import { Flow } from '../../classes/flow';
import { KnexFilter } from '../../classes/knex-filter';

export default class extends Flow {
    onSchema() {
        return 'system__record';
    }

    onRing() {
        return Flow.RING_WORK;
    }

    onSelect() {
        return true;
    }

    async run() {
        let knex = this.system.knex.tx(this.schema.type);
        let knex_filter = new KnexFilter(this.system, knex, this.filter);

        // Find all results, per the filter criteria
        let rows = await knex_filter.toStatement();

        // Convert to records
        this.change.length = 0;
        this.change.push(... rows.map((native: ChangeData) => this.schema.toRecord(native)));
    }
}
