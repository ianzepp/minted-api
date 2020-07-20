import * as Http from 'http';

// API
import { System } from './system';
import { Router } from './classes/router';
import { DataRouter } from './routers/data-router';
import { MetaRouter } from './routers/meta-router';

// Create the server
const server = Http.createServer(async (req: Http.IncomingMessage, res: Http.ServerResponse) => {
    // Generate the placeholder result
    let result = {
        path: req.url,
        method: req.method,
        status: 0,
        data: undefined as any
    };

    try {
        // Generate the system
        let system = new System({});
        let router: Router;

        // Check the user
        await system.authenticate();

        // Which router should handle this?
        if (result.path === undefined) {
            throw new Error('Undefined request path');
        }

        else if (result.path === '/api/data') {
            router = new DataRouter(system, req, res);
        }

        else if (result.path === '/api/meta') {
            router = new MetaRouter(system, req, res);
        }

        else {
            throw new Error('Unsupported request path ' + result.path);
        }

        // Process route
        result.data = await router.run() ?? null;

        // Status is always 200 when no errors
        result.status = 200;
    }

    catch (error) {
        result.status = 500;
        result.data = error.message;
    }

    finally {
        console.warn('res: %j', result);

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
