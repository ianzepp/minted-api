import _ from 'lodash';

// API
import { RecordInfo } from '../../typedefs/record';

// Classes
import { KnexFlow } from '../../classes/knex-flow';
import { System } from '../../classes/system';

export default class extends KnexFlow {
    onUpdate() {
        return true;
    }

    toOperation(record: RecordInfo) {
        // Sanity checks
        record.expect('data.id').a('string');

        // Make changes
        record.meta.updated_at = System.NOW;
        record.meta.updated_by = this.system.user.id;

        // Convert to flat data
        let native = _.omit(record.toFlatDiff(), ['id', 'ns']);

        // Done
        return this.toKnex().where({
            id: record.data.id,
            meta__trashed_at: null,
            meta__trashed_by: null,
        }).update(native);
    }
}
