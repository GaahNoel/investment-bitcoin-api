import { WinstonLogger } from '@/infra/libs/winston-logger.lib'
import { RabbitMQQueue } from '@/infra/queue/rabbit-mq.queue'
import { PrismaClientRepository } from '@/infra/repositories/prisma/prisma-client.repository'
import { env } from '../config/env'
import { PrismaInvestmentRepository } from '@/infra/repositories/prisma/prisma-investment.repository'
import { BuyBitcoinUseCase } from '@/domain/usecases/buy-bitcoin.usecase'
import { BuyBitcoinController } from '@/application/controllers/buy-bitcoin.controller'
import { BitcoinAPI } from '@/infra/api/bitcoin.api'
import { NodeFetch } from '@/infra/http/node-fetch.http'
import { RedisCache } from '@/infra/cache/redis.cache'
import { FakeBitcoinAPI } from '@/fakes/bit-coin-api.fake'

export class BuyBitcoinControllerFactory {
  static make(): BuyBitcoinController {
    const logger = new WinstonLogger()
    const httpClient = new NodeFetch()
    const cache = new RedisCache(logger)
    const clientRepository = new PrismaClientRepository(logger)
    const sendToQueue = new RabbitMQQueue(env.RABBITMQ_URL, logger)
    const investmentRepository = new PrismaInvestmentRepository(logger)
    const bitcoinApi = env.ENV === 'test' ? new FakeBitcoinAPI() : new BitcoinAPI(httpClient, cache, logger)

    const createClientUseCase = new BuyBitcoinUseCase(clientRepository, bitcoinApi, investmentRepository, clientRepository, sendToQueue, logger)

    return new BuyBitcoinController(createClientUseCase, logger)
  }
}
