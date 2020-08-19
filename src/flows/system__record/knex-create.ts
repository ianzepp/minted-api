import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// API
import { RecordInfo } from '../../typedefs/record';

// Classes
import { KnexFlow } from '../../classes/knex-flow';
import { System } from '../../classes/system';

export default class extends KnexFlow {
    onCreate() {
        return true;
    }

    toOperation(record: RecordInfo) {
        // Sanity checks
        record.expect('data.id').null;

        // Make changes
        record.data.id = uuid();
        record.data.ns = this.system.user.ns;
        record.data.sc = this.system.user.sc || null;

        record.meta.created_at = System.NOW;
        record.meta.created_by = this.system.user.id;
        record.meta.updated_at = System.NOW;
        record.meta.updated_by = this.system.user.id;
        record.meta.trashed_at = null;
        record.meta.trashed_by = null;

        record.acls.full = record.acls.full || [];
        record.acls.edit = record.acls.edit || [];
        record.acls.read = record.acls.read || [];
        record.acls.deny = record.acls.deny || [];

        // Done
        return this.toKnex().insert(record.toFlat());
    }
}
