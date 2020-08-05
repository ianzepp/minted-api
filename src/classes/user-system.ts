import { System } from '../classes/system';

export class UserSystem {
    private readonly _user_id = this.system.uuid();

    constructor(private readonly system: System) {

    }

    /** Returns the ID of the current context */
    get user_id() {
        return this._user_id;
    }

    isRoot() {
        return this.system.options.user_id === null;
    }

    isUser() {
        return this.system.options.user_id !== null;
    }
}
