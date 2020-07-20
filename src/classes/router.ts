import * as Http from 'http';

// API
import { System } from '../system';

export interface RouterResult {
    method: string | undefined,
    path: string | undefined,
    code: number,
    data: any
}

export class Router {
    constructor(readonly system: System, readonly req: Http.IncomingMessage, readonly res: Http.ServerResponse) {

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

        throw new Error('Unsupported operation ' + this.req.method);
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
}
