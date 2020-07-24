import _ from 'lodash';

// API
import { Router } from '../classes/router';

// Implementation
export default class extends Router {
    onRouterPath() {
        return '/api/data/:schema';
    }

    onSelect() {
        return true;
    }

    async run() {
        return this.system.meta.toFilter(this.params.schema, this.search).selectAll();
    }
}
