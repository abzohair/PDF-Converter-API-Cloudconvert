const http = require('http');
// const https = require('https');
const app = require('./app');

const normalizePort = val => {

    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || 4000);
// // const server = http.createServer(app); => ancien
// const options = {
//     key: fs.readFileSync("./dev-key-localhost.pem"),
//     cert: fs.readFileSync("./dev-cert-localhost.pem"),
// };

// const server = https.createServer(options, app);
const server = http.createServer(app);

const errorHandler = error => {

    if (error.syscall !== 'listen') {
        throw error;
    }

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + 'requires elevated privileges.');
            process.exit(1);
            break;

        case 'EADDRINUSE':
            console.error(bind + 'Is already in use.');
            process.exit(1);
            break;

        default:
            throw error;
    }
};

server.on('error', errorHandler);

server.on('listening', () => {

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port ' + port;
    console.log(`Listening on ${bind}`);
});

process.on("uncaughtException", (err) => {
    if (err && err.message && err.message.includes("aborted")) {
        return;
    }
    console.error("Uncaught Exception:", err);
});

server.listen(port, () => console.log(`HTTP server running at http://localhost:${port}`));