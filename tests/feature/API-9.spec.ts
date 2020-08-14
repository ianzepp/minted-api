import _ from 'lodash';
import 'mocha';

// Tests
import { Test } from '../test';
import { TestHttp } from '../test-http';

// Script
describe('API-9', () => {
    it('POST /api/data/<schema>/search => no filter', async () => {
        let result = await TestHttp.raw('POST', '/api/data/system__schema/search');

        Test.isRecordList(result).length.gt(1);
    });

    it('POST /api/data/<schema>/search + limit=1', async () => {
        let result = await TestHttp.raw('POST', '/api/data/system__schema/search', null, {
            limit: 1
        });

        Test.isRecordList(result).length(1);
    });
});
