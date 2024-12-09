import { GetBitcoinPriceController } from '@/application/controllers/get-bitcoin-price.controller'
import { GetBitcoinPriceUseCase } from '@/domain/usecases/get-bitcoin-price.usecase'
import { BitcoinAPI } from '@/infra/api/bitcoin.api'
import { NodeFetch } from '@/infra/http/node-fetch.http'
import { WinstonLogger } from '@/infra/libs/winston-logger.lib'

export class GetBitcoinPriceControllerFactory {
  static make(): GetBitcoinPriceController {
    const httpClient = new NodeFetch()
    const logger = new WinstonLogger()
    const bitcoinApi = new BitcoinAPI(httpClient, logger)

    const getBitcoinPriceUseCase = new GetBitcoinPriceUseCase(bitcoinApi, logger)

    return new GetBitcoinPriceController(getBitcoinPriceUseCase, logger)
  }
}
