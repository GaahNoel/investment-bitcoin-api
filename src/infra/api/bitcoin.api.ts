import { GetBitcoinPriceOutput, GetBitcoinPriceRepository } from '@/domain/contracts/get-bitcoin-price-repository'
import { HttpGetClient } from '../contracts/http-client.contract'
import { env } from '@/main/config/env'
import { Logger } from '@/domain/contracts/logger.contract'

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
  constructor(private readonly httpGetClient: HttpGetClient, private readonly logger: Logger) {}

  async get(): Promise<GetBitcoinPriceOutput> {
    this.logger.info('Getting bitcoin price from bitcoin api')

    const response = await this.httpGetClient.get<BitcoinApiResponse>({
      url: `${env.BITCOIN_API_URL}/api/BTC/ticker/`,
    })

    this.logger.info('Response received', response)

    return {
      buy: Number(response.ticker.buy),
      sell: Number(response.ticker.sell),
    }
  }
}
