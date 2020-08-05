
// API
import { FlowInfo } from '../typedefs/flow';
import { FlowRing } from '../typedefs/flow';
import { FlowSeriesInfo } from '../typedefs/flow';
import { SchemaName } from '../typedefs/schema';

// Classes
import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';

export class Flow implements FlowInfo {
    static readonly RING_INIT = 'init' as FlowRing;
    static readonly RING_PREP = 'prep' as FlowRing;
    static readonly RING_WORK = 'work' as FlowRing;
    static readonly RING_POST = 'post' as FlowRing;
    static readonly RING_DONE = 'done' as FlowRing;

    constructor(readonly system: System, readonly series: FlowSeriesInfo) {}

    get schema() {
        return this.series.schema;
    }

    get change() {
        return this.series.change;
    }

    get filter() {
        return this.series.filter;
    }

    async run(): Promise<unknown> {
        throw new SystemError(500, SystemError.UNIMPLEMENTED);
    }

    toJSON() {
        return {
            'on-schema': this.onSchema(),
            'on-ring': this.onRing(),
            'on-ring-priority': this.onRingPriority(),
            'on-root': this.onRoot(),
            'on-user': this.onUser(),
            'on-select': this.onSelect(),
            'on-create': this.onCreate(),
            'on-update': this.onUpdate(),
            'on-upsert': this.onUpsert(),
            'on-delete': this.onDelete(),
        };
    }

    onSchema(): SchemaName {
        throw new SystemError(500, SystemError.UNIMPLEMENTED);
    }

    onRing() {
        return Flow.RING_PREP;
    }

    onRingPriority() {
        return 100;
    }

    onRoot() {
        return true;
    }

    onUser() {
        return true;
    }

    onSelect() {
        return false;
    }

    onCreate() {
        return false;
    }

    onUpdate() {
        return false;
    }

    onUpsert() {
        return false;
    }

    onDelete() {
        return false;
    }

    isRunnable() {
        return true;
    }

    isSelect() {
        return this.series.isSelect();
    }

    isCreate() {
        return this.series.isCreate();
    }

    isUpdate() {
        return this.series.isUpdate();
    }

    isUpsert() {
        return this.series.isUpsert();
    }

    isDelete() {
        return this.series.isDelete();
    }
}
