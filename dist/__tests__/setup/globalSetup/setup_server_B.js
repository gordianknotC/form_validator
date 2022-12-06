import http from 'http';
function startServer(host, port) {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello Vitest\n');
        });
        server.listen(port, host, () => resolve(server));
    });
}
export async function setupServerB() {
    const server = await startServer('0.0.0.0', 9876);
    return async () => new Promise(resolve => server.close(() => resolve()));
}
//# sourceMappingURL=setup_server_B.js.map