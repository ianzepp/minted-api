import * as _ from 'lodash';
import * as Http from 'http';
import { match } from 'path-to-regexp';

// API
import { System, SystemError } from '../system';

export interface RouterResult {
    method: string | undefined,
    path: string | undefined,
    code: number,
    data: any
}

export class Router {
    // Stores the discovered path params
    private _params: _.Dictionary<string> | undefined;
    private _search: _.Dictionary<any> | undefined;

    constructor(readonly system: System, readonly req: Http.IncomingMessage, readonly res: Http.ServerResponse) {

    }

    /** Returns the router path with named parameters (eg, "/api/data/:schema/:id?") */
    toRouterPath() {
        return '/';
    }

    /** Returns the evaluated named parameters */
    get params() {
        return this._params ?? (this._params = this._to_params());
    }

    /** Returns the search data (from either the URL or the body) */
    get search() {
        return this._search ?? (this._search = this._to_search());
    }

    async runsafe() {
        try {
            return this.run();
        }

        catch (error) {
            return this.toResult(500, error.message);
        }
    }

    async run(): Promise<RouterResult> {
        if (this.isSelect()) {
            return this.onSelect();
        }

        if (this.isCreate()) {
            return this.onCreate();
        }

        if (this.isUpdate()) {
            return this.onUpdate();
        }

        if (this.isUpsert()) {
            return this.onUpsert();
        }

        if (this.isDelete()) {
            return this.onDelete();
        }

        if (this.isOption()) {
            return this.onOption();
        }

        throw new SystemError(500, SystemError.UNSUPPORTED, this.req.method)
    }

    isOption() {
        return this.req.method === 'OPTION';
    }

    isSelect() {
        return this.req.method === 'GET';
    }

    isCreate() {
        return this.req.method === 'POST';
    }

    isUpdate() {
        return this.req.method === 'PATCH';
    }

    isUpsert() {
        return this.req.method === 'PUT';
    }

    isDelete() {
        return this.req.method === 'DELETE';
    }

    async onOption(): Promise<RouterResult> {
        return this.toUnimplementedRoute();
    }

    async onSelect(): Promise<RouterResult> {
        return this.toUnimplementedRoute();
    }

    async onCreate(): Promise<RouterResult> {
        return this.toUnimplementedRoute();
    }

    async onUpdate(): Promise<RouterResult> {
        return this.toUnimplementedRoute();
    }

    async onUpsert(): Promise<RouterResult> {
        return this.toUnimplementedRoute();
    }

    async onDelete(): Promise<RouterResult> {
        return this.toUnimplementedRoute();
    }

    toResult(code: number = 200, data: any = null): RouterResult {
        return {
            method: this.req.method,
            path: this.req.url,
            code: code,
            data: data
        };
    }

    toUnimplementedRoute() {
        return this.toResult(400, 'Unimplemented route');
    }

    //
    // Private helpers
    //

    private _parse_url() {
        return new URL(this.req.url ?? '/');
    }

    private _to_params() {
        return _.get(match(this._parse_url().pathname), 'params') as _.Dictionary<string> || {};
    }

    private _to_search() {
        return this._parse_url().searchParams;
    }
}
