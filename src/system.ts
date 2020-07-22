import * as _ from 'lodash';
// import { format } from 'util';
import { v4 as uuid } from 'uuid';

// Subsystems
import { BulkSystem } from './classes/bulk-system';
import { DataSystem } from './classes/data-system';
import { FlowSystem } from './classes/flow-system';
import { MetaSystem } from './classes/meta-system';
import { UserSystem } from './classes/user-system';

export class SystemError extends Error {
    static UNIMPLEMENTED = 'unimplemented: This method is currently unimplemented';
    static UNINITIALIZED = 'uninitialized: This object has not been properly initialized';
    static UNSUPPORTED = 'unsupported: This method is currently unimplemented: %j';

    constructor(readonly code: number = 500, message: string = 'System error', ... params: any) {
        // super(format(message, params));
        super(message);
    }

    static testInitialized(test: any) {
        return SystemError.test(test, 500, SystemError.UNINITIALIZED);
    }

    static test(test: any, code: number, message: string, ... params: any) {
        if (test === undefined) {
            throw new SystemError(code, message, params);
        }

        else {
            return test;
        }
    }
}

export class System {
    // Services
    public readonly bulk = new BulkSystem(this);
    public readonly data = new DataSystem(this);
    public readonly flow = new FlowSystem(this);
    public readonly meta = new MetaSystem(this);
    public readonly user = new UserSystem(this);

    // Setup the user-specific system, or default to a root user.
    constructor(readonly options: _.Dictionary<any>) {

    }

    /** Returns a new UUID v4 */
    uuid() {
        return uuid();
    }

    /** Returns the current timestamp as an ISO string */
    datetime() {
        return new Date().toISOString();
    }

    /** Returns a new set of record info properties */
    info() {
        return {
            access_deny: null,
            access_edit: null,
            access_full: null,
            access_read: null,
            created_at: this.datetime(),
            created_by: this.uuid(),
            id: this.uuid(),
            trashed_at: null,
            trashed_by: null,
            updated_at: this.datetime(),
            updated_by: this.uuid(),
        };
    }

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
