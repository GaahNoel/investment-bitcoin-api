import { GetBitcoinPriceController } from '@/application/controllers/get-bitcoin-price.controller'
import { GetBitcoinPriceUseCase } from '@/domain/usecases/get-bitcoin-price.usecase'
import { BitcoinAPI } from '@/infra/api/bitcoin.api'
import { RedisCache } from '@/infra/cache/redis.cache'
import { NodeFetch } from '@/infra/http/node-fetch.http'
import { WinstonLogger } from '@/infra/libs/winston-logger.lib'

export class GetBitcoinPriceControllerFactory {
  static make(): GetBitcoinPriceController {
    const httpClient = new NodeFetch()
    const logger = new WinstonLogger()
    const cache = new RedisCache(logger)
    const bitcoinApi = new BitcoinAPI(httpClient, cache, logger)

    const getBitcoinPriceUseCase = new GetBitcoinPriceUseCase(bitcoinApi, logger)

    return new GetBitcoinPriceController(getBitcoinPriceUseCase, logger)
  }
}
