import _ from 'lodash';

// API
import { Router } from '../../classes/router';

// Implementation
export default class extends Router {
    onRouterPath() {
        return '/api/bulk';
    }

    onCreate() {
        return true;
    }

    async run() {
        // return this.system.bulk;
    }
}
