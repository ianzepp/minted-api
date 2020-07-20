import * as _ from 'lodash';
import Knex from 'knex';

export const KnexClient = Knex({
    client: 'sqlite3',
    connection: {
        filename: 'dst/sqlite3.db'
    }
});
