import { GetBitcoinPriceOutput, GetBitcoinPriceRepository } from '@/domain/contracts/get-bitcoin-price-repository'
import { HttpGetClient } from '../contracts/http-client.contract'
import { env } from '@/main/config/env'
import { Logger } from '@/domain/contracts/logger.contract'
import { Cache } from '../contracts/cache.contract'

type BitcoinApiResponse = {
  ticker: {
    high: string
    low: string
    vol: string
    last: string
    buy: string
    sell: string
    open: string
    date: number
    pair: 'BRLBTC'
  }
}

export class BitcoinAPI implements GetBitcoinPriceRepository {
  private cacheKey = 'bitcoin-api'
  private cacheExpirationInSeconds = 3.600

  constructor(
    private readonly httpGetClient: HttpGetClient,
    private readonly cache: Cache,
    private readonly logger: Logger,
  ) {}

  static toDomain(input: BitcoinApiResponse): GetBitcoinPriceOutput {
    return {
      buy: Number(input.ticker.buy),
      sell: Number(input.ticker.sell),
    }
  }

  async get(): Promise<GetBitcoinPriceOutput> {
    this.logger.info('Getting bitcoin price from bitcoin api')

    const cachedResponse = await this.cache.get<BitcoinApiResponse>(this.cacheKey)

    if (cachedResponse) {
      return BitcoinAPI.toDomain(cachedResponse)
    }

    const response = await this.httpGetClient.get<BitcoinApiResponse>({
      url: `${env.BITCOIN_API_URL}/api/BTC/ticker/`,
    })

    this.logger.info('Response received', response)

    await this.cache.save({
      key: this.cacheKey,
      value: response,
      expirationInSeconds: this.cacheExpirationInSeconds,
    })

    return BitcoinAPI.toDomain(response)
  }
}
