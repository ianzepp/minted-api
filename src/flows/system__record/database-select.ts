
import { Flow } from '../../classes/flow';
import { FlowRing } from '../../classes/flow-info';

export default class extends Flow<T> {
    onRing() {
        return FlowRing.Work;
    }

    onSchema() {
        return '*';
    }

    onSelect() {
        return true;
    }

    async run() {
        return this.system.data.driver.select<T>(this.schema, this.filter);
    }
}
