import _ from 'lodash';
import 'mocha';

// Tests
import { Test } from '../test';
import { TestHttp } from '../test-http';

// Script
describe.skip('1.0.0 > Http Server', () => {
    it('POST /api/data/<schema>/search', async () => {
        let result_all = await TestHttp.searchAll('system__schema', {});

        Test.isRecordList(result_all).not.empty;
    });

    // it('POST /api/data/<schema>/search', async () => {
    //     let result_all = await TestHttp.searchAll('system__schema', {
    //         limit: 1
    //     });
    //
    //     Test.isRecordList(result_all).length(1);
    //
    //     let result_one = await TestHttp.selectOne('system__schema', {
    //         where: { id: result_all[0].data.id },
    //         limit: 1
    //     });
    //
    //     Test.isRecord(result_one);
    // });
});
