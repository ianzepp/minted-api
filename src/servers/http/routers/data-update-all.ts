import _ from 'lodash';

// API
import { HttpRouter } from '../http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.data.updateAll(this.params.schema, this.body);
    }
}
