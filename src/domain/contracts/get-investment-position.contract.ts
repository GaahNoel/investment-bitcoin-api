export type GetInvestmentPositionOutput = {
  orderDate: string
  investmentValue: number
  amount: number
  bitcoinPrice: number
  bitcoinVariationPercent: number
  grossCurrentInvestmentValue: number
}

export type GetInvestmentPositionInput = {
  id: string
}

export interface GetInvestmentPosition {
  handle(input: GetInvestmentPositionInput): Promise<GetInvestmentPositionOutput[]>
}
