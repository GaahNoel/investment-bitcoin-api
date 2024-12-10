import { GetBitcoinPriceOutput, GetBitcoinPriceRepository } from '@/domain/contracts/get-bitcoin-price-repository'

export class FakeBitcoinAPI implements GetBitcoinPriceRepository {
  async get(): Promise<GetBitcoinPriceOutput> {
    return {
      buy: 10,
      sell: 15,
    }
  }
}
