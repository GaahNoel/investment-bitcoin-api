export type GetBitcoinPriceOutput = {
  buy: number
  sell: number
}

export interface GetBitcoinPrice {
  handle(): Promise<GetBitcoinPriceOutput>
}
