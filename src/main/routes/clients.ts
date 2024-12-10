import { FastifyInstance } from 'fastify'
import { FastifyAdapter } from '../adapters/fastify.adapter'
import { RegisterControllerFactory } from '../factories/register-controller.factory'
import { LoginControllerFactory } from '../factories/login-controller.factory'
import { DepositControllerFactory } from '../factories/deposit-controller.factory'
import { AuthMiddlewareFactory } from '../factories/auth-middleware.factory'
import { GetClientBalanceControllerFactory } from '../factories/get-client-balance-controller.factory'
import { BuyBitcoinControllerFactory } from '../factories/buy-bicoin-controller.factory'
import { GetInvestmentPositionControllerFactory } from '../factories/get-investment-position-controller.factory'

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
          amount: {
            type: 'number',
          },
        },
      },
      headers: {
        type: 'object',
        properties: {
          Authorization: {
            type: 'string',
          },
        },
      },
    },
  }, (request, reply) => FastifyAdapter.adaptRoute(DepositControllerFactory.make(), request, reply))

  server.get('/balance', {
    preHandler: (request, reply) => FastifyAdapter.adaptMiddleware(AuthMiddlewareFactory.make(), request, reply),
    schema: {
      headers: {
        type: 'object',
        properties: {
          Authorization: {
            type: 'string',
          },
        },
      },
    },
  }, (request, reply) => FastifyAdapter.adaptRoute(GetClientBalanceControllerFactory.make(), request, reply))

  server.post('/buy-bitcoin', {
    preHandler: (request, reply) => FastifyAdapter.adaptMiddleware(AuthMiddlewareFactory.make(), request, reply),
    schema: {
      body: {
        type: 'object',
        properties: {
          amount: {
            type: 'number',
          },
        },
      },
      headers: {
        type: 'object',
        properties: {
          Authorization: {
            type: 'string',
          },
        },
      },
    },
  }, (request, reply) => FastifyAdapter.adaptRoute(BuyBitcoinControllerFactory.make(), request, reply))

  server.get('/investments', {
    preHandler: (request, reply) => FastifyAdapter.adaptMiddleware(AuthMiddlewareFactory.make(), request, reply),
    schema: {
      headers: {
        type: 'object',
        properties: {
          Authorization: {
            type: 'string',
          },
        },
      },
    },
  }, (request, reply) => FastifyAdapter.adaptRoute(GetInvestmentPositionControllerFactory.make(), request, reply))
}
