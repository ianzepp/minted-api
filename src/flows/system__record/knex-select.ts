import * as _ from 'lodash';

import { Flow } from '../../classes/flow';
import { FlowRing } from '../../classes/flow-ring';
import { Record } from '../../classes/record';
import { RecordData } from '../../classes/record';

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
        let knex = this.system.knex.tx(this.schema.schema_name);

        // Find all results, per the filter criteria
        let rows = await knex;

        // Convert to records
        this.change.length = 0;
        this.change.push(... rows.map(native => this._to_record(native)));
    }

    private _to_record(native: RecordData) {
        return new Record(this.system, this.schema.schema_name, native);
    }
}
