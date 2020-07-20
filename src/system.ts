import * as _ from 'lodash';

// Subsystems
import { BulkSystem } from 'classes/bulk-system';
import { DataSystem } from 'classes/data-system';
import { MetaSystem } from 'classes/meta-system';
import { UserSystem } from 'classes/user-system';

export class System {
    // Services
    public readonly bulk = new BulkSystem(this);
    public readonly data = new DataSystem(this);
    public readonly meta = new MetaSystem(this);
    public readonly user = new UserSystem(this);

    // Setup the user-specific system, or default to a root user.
    constructor(readonly options: _.Dictionary<any>) {

    }

    /** Switches to a new root context and returns a new `System` reference */
    async toRoot() {
        return new System({ user_id: null });
    }

    /** Switches to a new root context and returns a new `System` reference */
    async toUser(user_id: string) {
        return new System({ user_id: user_id });
    }
}
