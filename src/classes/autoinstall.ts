import _ from 'lodash';
import chai from 'chai';
import uuid from 'uuid';

import { System } from '../classes/system';

export class AutoInstall {
    private readonly system = new System(); // always runs at the root level

    // In the beginning, there were two tables: Schema and Column
    async bootstrap() {
        return this.system.knex.transact(async () => {
            // Create schema table
            await this.system.knex.createTable('system__schema', (builder) => {
                builder.text('system__name').notNullable();
            });

            // Create column table
            await this.system.knex.createTable('system__column', (builder) => {
                builder.text('system__name').notNullable();
                builder.text('system__parent').notNullable();
            });
        });
    }

    // Run the migration for that version
    async run() {
        return this.system.knex.transact(async () => {
            // Insert core schema rows
            await this._create('system__schema', {
                system__name: 'system__schema'
            });

            await this._create('system__schema', {
                system__name: 'system__column'
            });

            // Verify that two schemas were created
            let result = await this.system.knex.tx('system__schema').select();

            chai.expect(result).a('array').length(2);

            chai.expect(result[0]).a('object');
            chai.expect(result[0]).property('id').a('string');
            chai.expect(result[0]).property('system__name', 'system__schema');

            chai.expect(result[1]).a('object');
            chai.expect(result[1]).property('id').a('string');
            chai.expect(result[1]).property('system__name', 'system__column');
        });
    }

    private _create(schema_name: string, data: _.Dictionary<any>) {
        // Copy in fixed column data
        data = _.assign({}, {
            id: uuid.v4(),
            ns: 'system',
            sc: null,
            meta__created_at: System.NOW,
            meta__created_by: System.UUIDZERO,
            meta__updated_at: System.NOW,
            meta__updated_by: System.UUIDZERO
        }, data);

        // Run create
        return this.system.knex.tx(schema_name).insert(data);
    }
}
