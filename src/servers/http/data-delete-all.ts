import _ from 'lodash';
import Chai from 'chai';

// API
import { Router } from '../../classes/router';

// Implementation
export default class extends Router {
    onRouterPath() {
        return '/api/data/:schema';
    }

    onDelete() {
        return true;
    }

    async run() {
        Chai.expect(this.params).property('schema').a('string').not.empty;
        Chai.expect(this.change_list).a('array').not.empty;

        return this.system.data.deleteAll(this.params.schema, this.change_list);
    }
}
