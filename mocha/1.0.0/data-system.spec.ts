import Chai from 'chai';
import 'mocha';

// Classes
import { System } from '../../src/classes/system';

// Script
describe('1.0.0 > Data System', () => {
    let system = new System();

    describe('Select Ops', () => {
        it('system.data.selectAll()', async () => {
            let result = await system.data.selectAll({
                using: 'system__schema'
            });

            Chai.expect(result).a('array').not.empty;
        });

        it('system.data.selectOne()', async () => {
            let result = await system.data.selectOne({
                using: 'system__schema',
                where: [
                    { system__name: 'system__schema' }
                ]
            });

            Chai.expect(result).a('object');
        });

        it('system.data.select404()', async () => {
            let result = await system.data.select404({
                using: 'system__schema',
                where: [
                    { system__name: 'system__schema' }
                ]
            });

            Chai.expect(result).a('object');
        });
    });

    describe('Create Ops', () => {
        it('system.data.createAll()', async () => {

        });

        it('system.data.createOne()', async () => {

        });
    });
});
