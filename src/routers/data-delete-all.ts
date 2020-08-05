import _ from 'lodash';
import Chai from 'chai';

// API
import { Router } from '../classes/router';

// Implementation
export default class extends Router {
    onRouterPath() {
        return '/api/data/:schema';
    }

    onDelete() {
        return true;
    }

    async validate() {
        Chai.expect(this.params).property('schema').a('string').not.empty;
        Chai.expect(this.change).a('array').not.empty;
    }

    async run() {
        let change = this.change as _.Dictionary<any>[];
        let schema = this.system.meta.toSchema(this.params.schema);

        return schema.deleteAll(change);
    }
}
