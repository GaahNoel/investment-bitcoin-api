import { GetBitcoinPriceRepository } from '../contracts/get-bitcoin-price-repository'
import { GetBitcoinPrice, GetBitcoinPriceOutput } from '../contracts/get-bitcoin-price.contract'
import { Logger } from '../contracts/logger.contract'

export class GetBitcoinPriceUseCase implements GetBitcoinPrice {
  constructor(private readonly getBitcoinPriceRepository: GetBitcoinPriceRepository, private readonly logger: Logger) {}
  async handle(): Promise<GetBitcoinPriceOutput> {
    this.logger.info('Searching for bit coin current price')
    const response = await this.getBitcoinPriceRepository.get()
    this.logger.info('Bit coin current price found', {
      buy: response.buy,
      sell: response.sell,
    })
    return response
  }
}
