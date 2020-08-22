import _ from 'lodash';

// API
import { HttpRouter } from '../http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.data.deleteAll(this.params.schema, this.body);
    }
}