import _ from 'lodash';
import 'mocha';

// Tests
import { Test } from '../test';
import { TestHttp } from '../test-http';

// Script
describe('API-9', () => {
    describe('Schema Search API', () => {
        it('POST /api/data/<schema>/search => no filter', async () => {
            let result = await TestHttp.raw('POST', '/api/data/system__schema/search');

            Test.isRecordList(result).not.empty;
        });

        it('POST /api/data/<schema>/search + limit=1', async () => {
            let result = await TestHttp.raw('POST', '/api/data/system__schema/search', null, {
                limit: 1
            });

            Test.isRecordList(result).length(1);
        });

        it('POST /api/data/<schema>/search => using explicit name', async () => {
            let result = await TestHttp.raw('POST', '/api/data/system__schema/search', null, {
                where: { system__name: 'system__column' }
            });

            Test.isRecordList(result).length(1);
            Test.expect(result[0]).nested.property('data.system__name', 'system__column');
        });
    });

    describe('Schema REST API', () => {
        it('GET /api/data/<schema>', async () => {
            let result = await TestHttp.raw('GET', '/api/data/system__schema');

            Test.isRecordList(result).not.empty;
        });

        it('POST /api/data/<schema>', async () => {
            let create = await TestHttp.raw('POST', '/api/data/system__schema', null, [
                { system__name: 'testing_schema' }
            ]);

            Test.isRecordList(create).length(1);

            let verify = await TestHttp.raw('POST', '/api/data/system__schema/search', null, {
                where: { id: create[0].data.id }
            });

            Test.isRecordList(verify).length(1);
        });

        it('DELETE /api/data/<schema>', async () => {
            let create = await TestHttp.raw('POST', '/api/data/system__schema', null, [
                { system__name: 'testing_schema' }
            ]);

            Test.isRecordList(create).length(1);

            let remove = await TestHttp.raw('DELETE', '/api/data/system__schema', null, create);

            Test.isRecordList(remove).length(1);

            let verify = await TestHttp.raw('POST', '/api/data/system__schema/search', null, {
                where: { id: create[0].data.id }
            });

            Test.isRecordList(verify).length(0);
        });
    });

    describe('Record REST API', () => {
        it('POST /api/data/<schema>/new', async () => {
            let create = await TestHttp.raw('POST', '/api/data/system__schema/new', null, {
                system__name: 'testing_schema'
            });

            Test.isRecord(create);
        });

        it('GET /api/data/<schema>/<record>', async () => {
            let create = await TestHttp.raw('POST', '/api/data/system__schema/new', null, {
                system__name: 'testing_schema'
            });

            Test.isRecord(create);

            let select = await TestHttp.raw('GET', '/api/data/system__schema/' + create.data.id);

            Test.isRecord(select).nested.property('data.id', create.data.id);
        });

        it('PATCH /api/data/<schema>/<record>', async () => {
            let create = await TestHttp.raw('POST', '/api/data/system__schema/new', null, {
                system__name: 'testing_schema'
            });

            Test.isRecord(create);

            let update = await TestHttp.raw('PATCH', '/api/data/system__schema/' + create.data.id, null, {
                system__name: 'updated_record'
            });

            Test.isRecord(update).nested.property('data.system__name', 'updated_record');

            let verify = await TestHttp.raw('GET', '/api/data/system__schema/' + create.data.id);

            Test.isRecord(verify).nested.property('data.system__name', 'updated_record');
        });
    });
});
