export type GetBitcoinPriceOutput = {
  buy: number
  sell: number
}

export interface GetBitcoinPriceRepository {
  get(): Promise<GetBitcoinPriceOutput>
}
