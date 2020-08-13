import _ from 'lodash';
import Chai from 'chai';

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

    async validate() {
        Chai.expect(this.params).property('schema').a('string').not.empty;
    }

    async run() {
        let schema = this.system.meta.toSchema(this.params.schema);
        let filter = schema.toFilter(this.search);

        return filter.selectAll();
    }
}
