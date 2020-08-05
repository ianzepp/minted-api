
import { FilterInfo } from '../typedefs/filter';
import { SchemaName } from '../typedefs/schema';
import { SchemaInfo } from '../typedefs/schema';
import { RecordInfo } from '../typedefs/record';

export type FlowRing = 'init' | 'prep' | 'work' | 'post' | 'done';

export interface FlowSeriesInfo {
    /** Returns the schema for the parent database operation. */
    readonly schema: SchemaInfo;

    /** Returns the filter (if any) in the parent database operation. */
    readonly filter: FilterInfo;

    /** Returns the set of changes (as records) from the parent database operation. These records are modified in-place by each flow, as needed. */
    readonly change: RecordInfo[];

    /** Returns `true` if the flow series operation is one of the `select` variants */
    isSelect(): boolean;

    /** Returns `true` if the flow series operation is one of the `create` variants */
    isCreate(): boolean;

    /** Returns `true` if the flow series operation is one of the `update` variants */
    isUpdate(): boolean;

    /** Returns `true` if the flow series operation is one of the `upsert` variants */
    isUpsert(): boolean;

    /** Returns `true` if the flow series operation is one of the `delete` variants */
    isDelete(): boolean;

    /** Run the initialization process for the flow, prior to executing anything */
    initialize(): Promise<unknown>;

    /** Run one ring of the flow series */
    run(ring: FlowRing): Promise<unknown>;
}

export interface FlowInfo {
    /** Returns the parent flow series */
    readonly series: FlowSeriesInfo;

    /** Proxy to `series.schema` */
    readonly schema: SchemaInfo;

    /** Proxy to `series.filter` */
    readonly filter: FilterInfo;

    /** Proxy to `series.change` */
    readonly change: RecordInfo[];

    /** Defines the code to be executed. */
    run(): Promise<unknown>;

    /** Returns the schema that applies to the flow. This method **MUST** be implemented */
    onSchema(): SchemaInfo | SchemaName;

    /** Returns the ring when the flow should execute. Defaults to `FlowRing.Prep` */
    onRing(): FlowRing;

    /** Returns the priority within the ring. Used for sorting flows. Typical values are 0 (high) to 1000 (low) */
    onRingPriority(): number;

    /** Returns `true` if the flow should be executed in a `root` context. Defaults to `true` */
    onRoot(): boolean;

    /** Returns `true` if the flow should be executed in a `user` context. Defaults to `true` */
    onUser(): boolean;

    /** Returns `true` if this flow should run under a `select` context. Defaults to `false` */
    onSelect(): boolean;

    /** Returns `true` if this flow should run under a `create` context. Defaults to `false` */
    onCreate(): boolean;

    /** Returns `true` if this flow should run under a `update` context. Defaults to `false` */
    onUpdate(): boolean;

    /** Returns `true` if this flow should run under a `upsert` context. Defaults to `false` */
    onUpsert(): boolean;

    /** Returns `true` if this flow should run under a `select` context. Defaults to `false` */
    onDelete(): boolean;

    /** Returns `true` if this flow should be executed (at all). Defaults to `true` */
    isRunnable(): boolean;

    /** Proxy to `series.isSelect()` */
    isSelect(): boolean;

    /** Proxy to `series.isSelect()` */
    isCreate(): boolean;

    /** Proxy to `series.isUpdate()` */
    isUpdate(): boolean;

    /** Proxy to `series.isUpsert()` */
    isUpsert(): boolean;

    /** Proxy to `series.isDelete()` */
    isDelete(): boolean;
}
