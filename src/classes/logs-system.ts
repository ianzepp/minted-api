import _ from 'lodash';
import debug from 'debug';

// API
import { RecordInfo } from '../typedefs/record';

// Classes
import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';

export class LogsSystem {
    constructor(private readonly system: System) {}

    wrap(wrapped_name: string) {
        return debug('minted-api:' + wrapped_name);
    }

    list(records: RecordInfo[]) {
        records.forEach(record => console.info('%j', record));
    }

    info(message: string, ... args: any[]) {
        console.info('INFO ' + message, ... args);
    }

    warn(message: string, ... args: any[]) {
        console.warn('WARN ' + message, ... args);
    }

    fail(message: string, ... args: any[]) {
        throw new SystemError(500, message, ... args);
    }
}
