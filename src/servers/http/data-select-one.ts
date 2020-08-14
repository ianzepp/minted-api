import _ from 'lodash';
import Chai from 'chai';

// API
import { Router } from '../../classes/router';

// Implementation
export default class extends Router {
    onRouterPath() {
        return '/api/data/:schema/:record';
    }

    onSelect() {
        return true;
    }

    async validate() {
        Chai.expect(this.params).property('schema').a('string').not.empty;
        Chai.expect(this.params).property('record').a('string').not.empty;
    }

    async run() {
        return this.system.meta.toFilter(this.params.schema, {
            where: [
                { id: this.params.record }
            ]
        }).select404();
    }
}
