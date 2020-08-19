import _ from 'lodash';
import 'mocha';

// Classes
import { System } from '../../src/classes/system';

// Tests
import { Test } from '../test';

// Script
describe('1.0.0 > Data System', () => {
    let system = new System();

    it('system.data.selectAll()', async () => {
        let result = await system.data.selectAll('system__schema', {});

        Test.isRecordList(result);
    });

    it('system.data.selectOne()', async () => {
        let result = await system.data.selectOne('system__schema', {});

        Test.isRecord(result);
    });

    it('system.data.select404()', async () => {
        let result = await system.data.select404('system__schema', {
            where: [
                { system__name: 'system__schema' }
            ]
        });

        Test.isRecord(result);
    });

    it('system.data.createAll()', async () => {
        let result = await system.data.createAll('system__schema', [
            { system__name: 'create_test_0' },
            { system__name: 'create_test_1' },
        ]);

        Test.isRecordList(result).length(2);
        Test.expect(result[0]).nested.property('data.system__name', 'create_test_0');
        Test.expect(result[1]).nested.property('data.system__name', 'create_test_1');

        let select_ids = result.map(item => item.data.id);
        let select = await system.data.selectIds('system__schema', select_ids);

        Test.isRecordList(select).length(2);
    });

    it('system.data.createOne()', async () => {
        let result = await system.data.createOne('system__schema', {
            system__name: 'create_test_2'
        });

        Test.isRecord(result);
        Test.expect(result).nested.property('data.system__name', 'create_test_2');
    });

    it('system.data.updateAll()', async () => {
        let source = await system.data.createAll('system__schema', [
            { system__name: 'update_test_0' },
            { system__name: 'update_test_1' },
        ]);

        Test.isRecordList(source);
        Test.expect(source[0]).nested.property('data.system__name', 'update_test_0');
        Test.expect(source[1]).nested.property('data.system__name', 'update_test_1');

        source[0].data.system__name = 'update_test_0_done';
        source[1].data.system__name = 'update_test_1_done';

        let change = await system.data.updateAll('system__schema', source);

        Test.isRecordList(change);
        Test.expect(change[0]).nested.property('data.system__name', 'update_test_0_done');
        Test.expect(change[1]).nested.property('data.system__name', 'update_test_1_done');
    });

    it('system.data.deleteAll()', async () => {
        let source = await system.data.createAll('system__schema', [
            { system__name: 'update_test_0' },
            { system__name: 'update_test_1' },
            { system__name: 'update_test_2' },
            { system__name: 'update_test_3' },
            { system__name: 'update_test_4' },
        ]);

        Test.isRecordList(source);
        Test.expect(source[0]).nested.property('meta.trashed_at').null;
        Test.expect(source[1]).nested.property('meta.trashed_at').null;
        Test.expect(source[2]).nested.property('meta.trashed_at').null;
        Test.expect(source[3]).nested.property('meta.trashed_at').null;
        Test.expect(source[4]).nested.property('meta.trashed_at').null;

        let change = await system.data.deleteAll('system__schema', source);

        Test.isRecordList(change);
        Test.expect(source[0]).nested.property('meta.trashed_at').a('string');
        Test.expect(source[1]).nested.property('meta.trashed_at').a('string');
        Test.expect(source[2]).nested.property('meta.trashed_at').a('string');
        Test.expect(source[3]).nested.property('meta.trashed_at').a('string');
        Test.expect(source[4]).nested.property('meta.trashed_at').a('string');

        let select_ids = change.map(item => item.data.id);
        let select = await system.data.selectIds('system__schema', select_ids);

        Test.isRecordList(select).length(0);
    });
});
