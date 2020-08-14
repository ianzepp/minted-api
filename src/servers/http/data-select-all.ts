import _ from 'lodash';
import Chai from 'chai';

// API
import { Router } from '../../classes/router';

// Implementation
export default class extends Router {
    onRouterPath() {
        return '/api/data/:schema';
    }

    onSelect() {
        return true;
    }

    async validate() {
        Chai.expect(this.params).property('schema').a('string').not.empty;
    }

    async run() {
        return this.system.data.selectAll(this.params.schema, this.search);
    }
}
