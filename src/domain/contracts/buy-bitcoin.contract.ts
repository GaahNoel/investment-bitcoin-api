import { SavedInvestment } from '../entities/investment'

export type BuyBitcoinInput = {
  id: string
  amount: number
}

export interface BuyBitcoin {
  handle(input: BuyBitcoinInput): Promise<SavedInvestment>
}
