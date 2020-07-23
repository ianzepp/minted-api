
import { FlowInfo } from '../classes/flow-info';
import { FlowRing } from '../classes/flow-ring';
import { Schema } from '../classes/schema';

export abstract class Flow {
    constructor(readonly info: FlowInfo) {}

    /** Proxy to `info.system` */
    get system() {
        return this.info.system;
    }

    /** Proxy to `info.schema` */
    get schema() {
        return this.info.schema;
    }

    /** Proxy to `info.change` */
    get change() {
        return this.info.change;
    }

    /** Proxy to `info.filter` */
    get filter() {
        return this.info.filter;
    }

    /** Defines the code to be executed. This method **MUST** be implemented */
    abstract async run(): Promise<unknown>;

    /** Returns the schema that applies to the flow. This method **MUST** be implemented */
    abstract onSchema(): Schema | string;

    /** Returns the ring when the flow should execute. Defaults to `FlowRing.Prep` */
    onRing(): FlowRing {
        return FlowRing.Prep;
    }

    /** Returns the priority within the ring. Used for sorting flows. Typical values are 0 (high) to 1000 (low) */
    onRingPriority(): number {
        return 100;
    }

    /** Returns `true` if the flow should be executed in a `root` context. Defaults to `true` */
    onRoot() {
        return true;
    }

    /** Returns `true` if the flow should be executed in a `user` context. Defaults to `true` */
    onUser() {
        return true;
    }

    /** Returns `true` if this flow should run under a `select` context. Defaults to `false` */
    onSelect() {
        return false;
    }

    /** Returns `true` if this flow should run under a `create` context. Defaults to `false` */
    onCreate() {
        return false;
    }

    /** Returns `true` if this flow should run under a `update` context. Defaults to `false` */
    onUpdate() {
        return false;
    }

    /** Returns `true` if this flow should run under a `upsert` context. Defaults to `false` */
    onUpsert() {
        return false;
    }

    /** Returns `true` if this flow should run under a `select` context. Defaults to `false` */
    onDelete() {
        return false;
    }

    /** Returns `true` if this flow should be executed (at all). Defaults to `true` */
    isRunnable() {
        return true;
    }

    isSelect() {
        return this.info.isSelect();
    }

    isCreate() {
        return this.info.isCreate();
    }

    isUpdate() {
        return this.info.isUpdate();
    }

    isUpsert() {
        return this.info.isUpsert();
    }

    isDelete() {
        return this.info.isDelete();
    }
}
