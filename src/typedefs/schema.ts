
import { FilterData } from '../typedefs/filter';
import { FilterInfo } from '../typedefs/filter';
import { RecordInfo } from '../typedefs/record';
import { ChangeData } from '../typedefs/record';

export type SchemaName = string;
export type SchemaType = SchemaInfo | SchemaName;

export interface SchemaInfo extends RecordInfo {
    /** Generate a new filter */
    toFilter(source?: FilterData): FilterInfo;

    /** Generate a new record */
    toRecord(source?: ChangeData): RecordInfo;

    /** Proxy to `system.data.selectAll()` */
    selectAll(filter: FilterInfo): Promise<RecordInfo[]>;

    /** Proxy to `system.data.selectOne()` */
    selectOne(filter: FilterInfo): Promise<RecordInfo | undefined>;

    /** Proxy to `system.data.select404()` */
    select404(filter: FilterInfo): Promise<RecordInfo>;

    /** Proxy to `system.data.createAll()` */
    createAll(change: ChangeData[]): Promise<RecordInfo[]>;

    /** Proxy to `system.data.createOne()` */
    createOne(change: ChangeData): Promise<RecordInfo>;

    /** Proxy to `system.data.updateAll()` */
    updateAll(change: ChangeData[]): Promise<RecordInfo[]>;

    /** Proxy to `system.data.updateOne()` */
    updateOne(change: ChangeData): Promise<RecordInfo>;

    /** Proxy to `system.data.upsertAll()` */
    upsertAll(change: ChangeData[]): Promise<RecordInfo[]>;

    /** Proxy to `system.data.upsertOne()` */
    upsertOne(change: ChangeData): Promise<RecordInfo>;

    /** Proxy to `system.data.deleteAll()` */
    deleteAll(change: ChangeData[]): Promise<RecordInfo[]>;

    /** Proxy to `system.data.deleteOne()` */
    deleteOne(change: ChangeData): Promise<RecordInfo>;
}
