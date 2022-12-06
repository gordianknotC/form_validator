import http from 'http'

function startServer(host: string, port: number): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('Hello Vitest\n')
    })
    server.listen(port, host, () => resolve(server))
  })
}

export async function setupServerB() {
  const server = await startServer('0.0.0.0', 9876)
  return async () => new Promise<void>(resolve => server.close(() => resolve()))
}
