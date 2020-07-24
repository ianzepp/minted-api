import _ from 'lodash';

// API
import { Router } from '../classes/router';

// Implementation
export default class extends Router {
    onRouterPath() {
        return '/api/data/:schema';
    }

    onCreate() {
        return true;
    }

    async run() {
        let schema = this.system.meta.toSchema(this.params.schema);

        if (_.isArray(this.change)) {
            return schema.createAll(this.change);
        }

        else {
            return schema.createOne(this.change);
        }
    }
}
