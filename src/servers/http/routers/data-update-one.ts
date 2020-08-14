import _ from 'lodash';

// API
import { HttpRouter } from '../http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.data.updateOne(this.params.schema, this.body);
    }
}