import _ from 'lodash';

// API
import { HttpRouter } from '../http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        // Convert inbound data to records
        let change = this.system.meta.toRecord(this.params.schema, this.body);

        if (change.data.id === null) {
            change.data.id = this.params.record;
        }

        return this.system.data.updateOne(this.params.schema, change);
    }
}
