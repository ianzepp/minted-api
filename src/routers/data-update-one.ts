import _ from 'lodash';
import Chai from 'chai';

// API
import { Router } from '../classes/router';

// Implementation
export default class extends Router {
    onRouterPath() {
        return '/api/data/:schema/:record';
    }

    onUpdate() {
        return true;
    }

    async validate() {
        Chai.expect(this.params).property('schema').a('string').not.empty;
        Chai.expect(this.params).property('record').a('string').not.empty;
        Chai.expect(this.change_data).a('object').not.empty;
    }

    async run() {
        return this.system.data.updateOne(this.params.schema, this.change_data);
    }
}
