import { System } from 'system';

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
