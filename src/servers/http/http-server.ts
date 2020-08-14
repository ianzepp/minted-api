import _ from 'lodash';
import Http from 'http';
import { pathToRegexp, match } from 'path-to-regexp';

// Classes
import { System } from '../classes/system';
import { SystemError } from '../classes/system-error';
import { Router } from '../classes/router';
import { RouterResult } from '../classes/router';

// Routers
import DataSelectAll from '../servers/http/data-select-all';
import DataSelectOne from '../servers/http/data-select-one';
import DataUpdateAll from '../servers/http/data-update-all';
import DataUpdateOne from '../servers/http/data-update-one';

export class HttpServer {
    listen(port: number) {
        console.warn('Starting http server..');

        // Create the listening server
        return Http.createServer(async (req, res) => this.handle(req, res))
                   .setTimeout(1000)
                   .listen(port);
    }

    async handle(req: Http.IncomingMessage, res: Http.ServerResponse) {
        // Run the process
        try {
            let system = new System();

            // Generate all routers linked to this request
            let routers: Router[] = [
                new DataSelectOne(system, req, res),
                new DataSelectAll(system, req, res),
                new DataUpdateOne(system, req, res),
                new DataUpdateAll(system, req, res),
            ];

            // Find the first runnable router
            let active_router = routers.find(router => {
                return router.isRunnable() && router.isRouterPath();
            });

            // Nothing was found?
            if (active_router === undefined) {
                throw new SystemError(404, 'Unknown route %j', req.url);
            }

            // Start execution
            console.warn('>>', req.method, req.url);

            // Process the user
            await system.authenticate();

            // Process route
            let result = await active_router.runsafe();

            // Return the result
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(result));
            res.end();
        }

        catch (error) {
            // Generate the failure result
            let result: RouterResult = {
                method: req.method,
                path: req.url,
                code: error.code ?? 500,
                data: error.message,
            };

            // Return the result
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(result));
            res.end();
        }
    }
}
