import _ from 'lodash';
import Knex from 'knex';

// API
import { RecordInfo } from '../typedefs/record';

// Classes
import { Flow } from '../classes/flow';

export class KnexFlow extends Flow {
    onSchema() {
        return 'system__record';
    }

    onRing() {
        return Flow.RING_WORK;
    }

    toKnex() {
        return this.system.knex.tx(this.schema.name);
    }

    toChunkSize() {
        return 10;
    }

    toOperations() {
        return this.change.map(record => this.toOperation(record));
    }

    toOperation(record: RecordInfo): Knex.QueryBuilder {
        throw new Error('Unimplemented!');
    }

    async run() {
        for(let chunk of _.chunk(this.toOperations(), this.toChunkSize())) {
            await Promise.all(chunk);
        }
    }
}
