import _ from 'lodash';
import Chai from 'chai';
import { Method as AxiosMethod } from 'axios';
import Axios from 'axios';

// Typedefs
import { SchemaName } from '../src/typedefs/schema';
import { FilterJson } from '../src/typedefs/filter';

// classes
import { HttpServer } from '../src/servers/http/http-server';

export function toResultData(result: any) {
    Chai.expect(result).a('object');
    Chai.expect(result).property('code', 200, result.data);
    Chai.expect(result).property('data').exist;
    return _.get(result, 'data');
}

export class TestHttp {
    static SERVER_PORT = 8888;
    static SERVER = new HttpServer().listen(TestHttp.SERVER_PORT);

    static async raw(method: AxiosMethod, url: string, params?: any, data?: any): Promise<any> {
        // console.warn('TestHttp.raw() %j %j %j %j', method, url, params, data);

        let result_http = await Axios(`http://localhost:${TestHttp.SERVER_PORT}` + url, {
            method: method,
            params: params,
            data: data,
        });

        // Response wrapper 1 (from Axios)
        Chai.expect(result_http).property('status', 200);
        Chai.expect(result_http).property('data').a('object');

        // Response wrapper 2 (from API)
        Chai.expect(result_http).nested.property('data.code', 200);
        Chai.expect(result_http).nested.property('data.data').exist;

        //
        return _.get(result_http, 'data.data');
    }

    //
    // Pure HTTP methods
    //

    static async select(url: string, query?: any) {
        return TestHttp.raw('GET', url, query);
    }

    //
    // Helpers - These use standard typedefs so they aren't as "dirty" as they
    // perhaps should be for a test suite.
    //

    static async searchAll(schema_name: SchemaName, filter_data: FilterJson) {
        return TestHttp.raw('POST', `/api/data/${schema_name}/search`, null, filter_data).then(toResultData);
    }

    static async searchOne(schema_name: SchemaName, filter_data: FilterJson) {
        return TestHttp.raw('POST', `/api/data/${schema_name}/search`, null, filter_data).then(toResultData);
    }
}
