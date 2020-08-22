import _ from 'lodash';

// API
import { HttpRouter } from '../http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.data.select404(this.params.schema, {
            where: { id: this.params.record },
            limit: 1
        });
    }
}
