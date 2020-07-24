import * as _ from 'lodash';

// API
import { Router } from '../classes/router';

// Implementation
export default class extends Router {
    onRouterPath() {
        return '/api/data/:schema/:record';
    }

    onSelect() {
        return true;
    }

    async run() {
        return this.system.meta.toFilter(this.params.schema, {
            where: [
                { id: this.params.record }
            ]
        }).select404();
    }
}
