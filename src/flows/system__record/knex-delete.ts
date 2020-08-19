import _ from 'lodash';

// API
import { RecordInfo } from '../../typedefs/record';

// Classes
import { KnexFlow } from '../../classes/knex-flow';
import { System } from '../../classes/system';

export default class extends KnexFlow {
    onDelete() {
        return true;
    }

    toOperation(record: RecordInfo) {
        // Sanity checks
        record.expect('data.id').a('string');
        record.expect('meta.trashed_at').null;
        record.expect('meta.trashed_by').null;

        // Timestamps
        record.meta.trashed_at = System.NOW;
        record.meta.trashed_by = this.system.user.id;

        // Process
        return this.toKnex().where({ id: record.data.id }).update({
            meta__trashed_at: System.NOW,
            meta__trashed_by: this.system.user.id,
        });
    }
}
