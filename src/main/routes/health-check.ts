import { FastifyInstance } from 'fastify'
import { FastifyAdapter } from '../adapters/fastify-route.adapter'
import { HealthCheckControllerFactory } from '../factories/health-check-controller.factory'

export async function healthCheck(server: FastifyInstance) {
  server.get('/health-check', (request, reply) => FastifyAdapter.adapt(HealthCheckControllerFactory.make(), request, reply))
}
