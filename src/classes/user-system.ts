import _ from 'lodash';

import { System } from '../classes/system';

export class UserSystem {
    private readonly _user_id: string = '00000000-0000-0000-0000-000000000000';
    private readonly _user_ns: string = 'system';
    private readonly _user_sc: string | null = null;
    private _access_list: string[] | undefined;

    constructor(private readonly system: System) {

    }

    /** Returns the ID of the current context */
    get id() {
        return this._user_id;
    }

    /** Returns the user's current namespace */
    get ns() {
        return this._user_ns;
    }

    /** Returns the user's current security classification */
    get sc() {
        return this._user_sc;
    }

    /** Returns the current set of IDs used for ACL filtering */
    get access_list() {
        return (this._access_list = this._access_list || this._to_access_list());
    }

    isRoot() {
        return true;    // return this.system.options.user_id === null;
    }

    isUser() {
        return false;   // return this.system.options.user_id !== null;
    }

    //
    // Helpers
    //

    private _to_access_list() {
        return _.uniq(_.compact([System.UUIDZERO, this._user_id]));
    }
}
