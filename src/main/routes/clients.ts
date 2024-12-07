import { FastifyInstance } from 'fastify'
import { FastifyAdapter } from '../adapters/fastify.adapter'
import { RegisterControllerFactory } from '../factories/register-controller.factory'
import { LoginControllerFactory } from '../factories/login-controller.factory'
import { DepositControllerFactory } from '../factories/deposit-controller.factory'
import { AuthMiddlewareFactory } from '../factories/auth-middleware.factory'

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
  }, (request, reply) => FastifyAdapter.adaptRoute(RegisterControllerFactory.make(), request, reply))

  server.post('/login', {
    schema: {
      body: {
        type: 'object',
        properties: {
          password: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
        },
      },
    },
  }, (request, reply) => FastifyAdapter.adaptRoute(LoginControllerFactory.make(), request, reply))

  server.patch('/deposit', {
    preHandler: (request, reply) => FastifyAdapter.adaptMiddleware(AuthMiddlewareFactory.make(), request, reply),
    schema: {
      body: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          amount: {
            type: 'number',
          },
        },
      },
    },
  }, (request, reply) => FastifyAdapter.adaptRoute(DepositControllerFactory.make(), request, reply))
}
