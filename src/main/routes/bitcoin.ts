import { FastifyInstance } from 'fastify'
import { FastifyAdapter } from '../adapters/fastify.adapter'
import { GetBitcoinPriceControllerFactory } from '../factories/get-bitcoin-price-controller.factory'

export async function bitcoin(server: FastifyInstance) {
  server.get('/', (request, reply) => FastifyAdapter.adaptRoute(GetBitcoinPriceControllerFactory.make(), request, reply))
}
