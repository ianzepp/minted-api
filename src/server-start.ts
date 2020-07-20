import * as Http from 'http';

// API
import { System } from './system';

// Create the server
const server = Http.createServer(() => {});

// Force a very low timeout
server.setTimeout(1000);

// Handle requests
server.on('request', async (req, res) => {
    // Generate the system
    let system = new System({});

    // Authenticate the request
    await system.authenticate();

    // Build the result
    let result = {
        path: req.path,
        host: req.host,
        method: req.method,
        status: 200,
        data: {}
    };

    console.warn('res: %j', result);

    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(result));
    res.end();
});

server.on('close', () => {
    console.warn('server: closed.');
})

// Run
server.listen(8080);
console.warn('server: listening');
