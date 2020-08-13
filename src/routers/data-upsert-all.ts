import _ from 'lodash';
import Chai from 'chai';

// API
import { Router } from '../classes/router';

// Implementation
export default class extends Router {
    onRouterPath() {
        return '/api/data/:schema';
    }

    onUpsert() {
        return true;
    }

    async validate() {
        Chai.expect(this.params).property('schema').a('string').not.empty;
        Chai.expect(this.change_list).a('array').not.empty;
    }

    async run() {
        return this.system.data.upsertAll(this.params.schema, this.change_list);
    }
}
