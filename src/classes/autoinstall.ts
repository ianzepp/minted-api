import _ from 'lodash';

import { System } from '../classes/system';

export class AutoInstall {
    private readonly system = new System(); // always runs at the root level

    // In the beginning, there were two tables: Schema and Column
    async bootstrap() {
        return this.system.knex.transact(async () => {
            // Create tables
            await this.system.knex.createTable('system__schema');
            await this.system.knex.createTable('system__column');
        });
    }

    // Run the migration for that version
    async run() {
        return this.system.knex.transact(async () => {
            // // Find all schemas
            // let schema = this.system.meta.schemas.schema;
            // let result = await schema.selectAll({});
            //
            // this.system.logs.info('Found schemas: %j', result);
        });
    }
}
