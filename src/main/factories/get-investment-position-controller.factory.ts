import { GetInvestmentPositionController } from '@/application/controllers/get-investment-position.controller'
import { GetInvestmentPositionUseCase } from '@/domain/usecases/get-investment-position.usecase'
import { FakeBitcoinAPI } from '@/fakes/bit-coin-api.fake'
import { BitcoinAPI } from '@/infra/api/bitcoin.api'
import { RedisCache } from '@/infra/cache/redis.cache'
import { NodeFetch } from '@/infra/http/node-fetch.http'
import { WinstonLogger } from '@/infra/libs/winston-logger.lib'
import { PrismaInvestmentRepository } from '@/infra/repositories/prisma/prisma-investment.repository'
import { env } from '../config/env'

export class GetInvestmentPositionControllerFactory {
  static make() {
    const logger = new WinstonLogger()
    const httpClient = new NodeFetch()
    const cache = new RedisCache(logger)
    const investmentRepository = new PrismaInvestmentRepository(logger)
    const bitcoinApi = env.ENV === 'test' ? new FakeBitcoinAPI() : new BitcoinAPI(httpClient, cache, logger)

    const getInvestmentPositionUseCase = new GetInvestmentPositionUseCase(investmentRepository, bitcoinApi, logger)

    return new GetInvestmentPositionController(getInvestmentPositionUseCase, logger)
  }
}
