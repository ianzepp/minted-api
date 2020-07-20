import { System } from '~src/system';

export class UserSystem {
    constructor(private readonly system: System) {

    }

    isRoot() {
        return this.system.options.user_id === null;
    }

    isUser() {
        return this.system.options.user_id !== null;
    }
}
