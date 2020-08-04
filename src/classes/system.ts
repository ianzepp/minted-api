import _ from 'lodash';
// import { format } from 'util';
import { v4 as uuid } from 'uuid';

// API
import { RecordMeta } from '../typedefs/record';

// Subsystems
import { BulkSystem } from '../classes/bulk-system';
import { DataSystem } from '../classes/data-system';
import { KnexSystem } from '../classes/knex-system';
import { MetaSystem } from '../classes/meta-system';
import { UserSystem } from '../classes/user-system';

export class System {
    // Services
    public readonly bulk = new BulkSystem(this);
    public readonly data = new DataSystem(this);
    public readonly knex = new KnexSystem(this);
    public readonly meta = new MetaSystem(this);
    public readonly user = new UserSystem(this);

    // Setup the user-specific system, or default to a root user.
    constructor(readonly options: _.Dictionary<any> = {}) {

    }

    /** Returns a new UUID v4 */
    uuid() {
        return uuid();
    }

    /** Returns the current timestamp as an ISO string */
    datetime() {
        return new Date().toISOString();
    }

    // /** Returns a new set of record meta properties */
    // meta(): RecordMeta {
    //     return {
    //         access_deny: null,
    //         access_edit: null,
    //         access_full: null,
    //         access_read: null,
    //         created_at: this.datetime(),
    //         created_by: this.uuid(),
    //         id: this.uuid(),
    //         trashed_at: null,
    //         trashed_by: null,
    //         updated_at: this.datetime(),
    //         updated_by: this.uuid(),
    //     };
    // }

    /** Authenticate a request */
    async authenticate() {}

    /** Switches to a new root context and returns a new `System` reference */
    async toRoot() {
        return new System({ user_id: null });
    }

    /** Switches to a new root context and returns a new `System` reference */
    async toUser(user_id: string) {
        return new System({ user_id: user_id });
    }
}
