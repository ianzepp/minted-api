import * as _ from 'lodash';
import { match } from 'path-to-regexp';
import { URL } from 'url';

// API
import { Filter } from '../classes/filter';
import { Schema } from '../classes/schema';
import { Router } from '../classes/router';

// Path matcher
const matcher = match('/api/data/:schema/:id?', { decode: decodeURIComponent });

// Implementation
export class DataRouter extends Router {
    private readonly _url = new URL(this.req.url ?? '/');
    private readonly _url_match = matcher(this._url.pathname);

    // Unknowns
    private _schema_name: string | undefined;
    private _schema: Schema | undefined;
    // private _filter_data: _.Dictionary<any> | undefined;
    // private _filter: Filter | undefined;

    async toSchema() {
        // 1st pass: extract the schema name from the URL
        if (this._schema_name === undefined) {
            this._schema_name = _.get(this._url_match, 'params.schema');
        }

        // No schema name found? That's an error for this router
        if (this._schema_name === undefined) {
            throw new Error('Unable to identify schema name');
        }

        // Find/build the underlying schema data for that named schema
        if (this._schema === undefined) {
            this._schema = await this.system.meta.toSchema(this._schema_name);
        }

        // Done
        return this._schema;
    }

    async toFilter() {
        return this.system.meta.toFilter({});
    }

    async toChange() {
        return [];
    }

    async onSelect() {
        let schema = await this.toSchema();
        let filter = await this.toFilter();
        let result = await this.system.data.selectAll(schema, filter);

        // Done
        return this.toResult(200, result);
    }
}
