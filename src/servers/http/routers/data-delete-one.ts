import _ from 'lodash';

// API
import { HttpRouter } from '../http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.data.deleteOne(this.params.schema, {
            id: this.params.record
        });
    }
}
