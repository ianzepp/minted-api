import _ from 'lodash';
import Chai from 'chai';
import 'mocha';

// Classes
import { System } from '../../src/classes/system';

// Tests
import { ExpectApi } from '../expectations';

// Script
describe('1.0.0 > Data System', () => {
    let system = new System();

    describe('Select Ops', () => {
        it('system.data.selectAll()', async () => {
            let result = await system.data.selectAll('system__schema', {});

            Chai.expect(result).a('array').not.empty;
        });

        it('system.data.selectOne()', async () => {
            let result = await system.data.selectOne('system__schema', {
                where: [
                    { system__name: 'system__schema' }
                ]
            });

            ExpectApi.isRecord(result);
        });

        it('system.data.select404()', async () => {
            let result = await system.data.select404('system__schema', {
                where: [
                    { system__name: 'system__schema' }
                ]
            });

            ExpectApi.isRecord(result);
        });
    });

    describe('Create Ops', () => {
        it('system.data.createAll()', async () => {
            let result = await system.data.createAll('system__schema', [
                { system__name: 'test1' },
                { system__name: 'test2' },
            ]);

            Chai.expect(result).a('array').length(2);
            ExpectApi.isRecord(result[0]);
            ExpectApi.isRecord(result[1]);
        });

        it('system.data.createOne()', async () => {
            let result = await system.data.createOne('system__schema', {
                system__name: 'test3'
            });

            ExpectApi.isRecord(result);
        });
    });
});
