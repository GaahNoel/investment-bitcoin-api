import { FastifyInstance } from 'fastify'
import { FastifyAdapter } from '../adapters/fastify.adapter'
import { GetBitcoinPriceControllerFactory } from '../factories/get-bitcoin-price-controller.factory'
import { AuthMiddlewareFactory } from '../factories/auth-middleware.factory'

export async function bitcoin(server: FastifyInstance) {
  server.get('/', {
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
  }, (request, reply) => FastifyAdapter.adaptRoute(GetBitcoinPriceControllerFactory.make(), request, reply))
}
