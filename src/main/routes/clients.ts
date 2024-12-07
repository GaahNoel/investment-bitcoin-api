import { FastifyInstance } from 'fastify'
import { FastifyAdapter } from '../adapters/fastify-route.adapter'
import { RegisterControllerFactory } from '../factories/register-controller.factory'

export async function clients(server: FastifyInstance) {
  server.post('/register', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          balance: {
            type: 'number',
          },

        },
      },
    },
  }, (request, reply) => FastifyAdapter.adapt(RegisterControllerFactory.make(), request, reply))
}
