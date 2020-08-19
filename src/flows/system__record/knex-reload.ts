import _ from 'lodash';
import Chai from 'chai';

// Classes
import { Flow } from '../../classes/flow';
import { KnexFilter } from '../../classes/knex-filter';

export default class extends Flow {
    onSchema() {
        return 'system__record';
    }

    onRing() {
        return Flow.RING_INIT;
    }

    onUpdate() {
        return true;
    }

    onUpsert() {
        return true;
    }

    onDelete() {
        return true;
    }

    async run() {
        // Extract the IDs of inbound records
        let select_ids = _.uniq(_.compact(this.change.map(record => record.data.id)));

        // Create the reload filter
        let filter = this.schema.toFilter({ where: { id: { $in: select_ids }}});

        // Setup the knex statement
        let knex = this.system.knex.tx(this.schema.name);
        let knex_filter = new KnexFilter(this.system, knex, filter);

        // Find all matching results, per the filter criteria
        let result = await knex_filter.toStatement();

        // Sanity
        Chai.expect(select_ids).a('array').length(this.change.length);
        Chai.expect(result).a('array').length(this.change.length);

        // Index rows by ID
        let result_map = _.keyBy(result, 'id');

        // Iterate original records and apply original data
        this.change.forEach(record => record.initialize(result_map[record.data.id]));
    }
}
