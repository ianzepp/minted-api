import { RecordData } from '../classes/record';

export interface ColumnData extends RecordData {
    name: string;
    description: string | null;
    cacheable: boolean;
    secure: boolean;
    type: string;
}
