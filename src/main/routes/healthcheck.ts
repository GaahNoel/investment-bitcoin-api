import { FastifyInstance } from 'fastify'

export async function healthcheck(server: FastifyInstance) {
  server.get('/healthcheck', (request, reply) => {
    return reply.send('Live! ✅')
  })
}
