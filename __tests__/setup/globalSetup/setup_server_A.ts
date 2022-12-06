import { createServer } from 'vite'
import { resolve } from 'path'

export async function setupServerA() {
  const server = await createServer({
    root: resolve(__dirname, '..'),
    server: {
      port: 9988,
    },
  })

  await server.listen(9988)
  return async () => {
    await server.close()
  }
}
