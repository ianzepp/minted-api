import * as Http from 'http';

// API
import { Router } from './classes/router';
import { RouterResult } from './classes/router';
import { System } from './classes/system';
import { SystemError } from './classes/system-error';

// Routers
import DataSelectAll from './routers/data-select-all';
import DataSelectOne from './routers/data-select-one';

// Create the server
const server = Http.createServer(async (req: Http.IncomingMessage, res: Http.ServerResponse) => {
    // Run the process
    try {
        // Generate the system
        let system = new System({});

        // Generate all routers linked to this request
        let routers: Router[] = [
            new DataSelectOne(system, req, res),
            new DataSelectAll(system, req, res),
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
});

// Force a very low timeout
server.setTimeout(1000);

// Logging on close
server.on('close', () => {
    console.warn('server: closed.');
})

// Run
server.listen(8080);
console.warn('server: listening');
