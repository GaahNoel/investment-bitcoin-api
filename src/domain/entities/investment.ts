import { Transaction, TransactionInput, TransactionType } from './transaction'

export type InvestmentInput = TransactionInput & {
  bitcoinPrice: number
  investmentValue: number
}

export type SavedInvestmentInput = InvestmentInput & {
  id: string
}

export class Investment extends Transaction {
  readonly type = TransactionType.Investment
  private readonly _bitcoinPrice: number
  private readonly _investmentValue: number
  constructor(input: InvestmentInput) {
    const { bitcoinPrice, investmentValue, ...transactionInput } = input
    super(transactionInput)

    this._bitcoinPrice = bitcoinPrice
    this._investmentValue = investmentValue
  }

  public get bitcoinPrice() {
    return this._bitcoinPrice
  }

  public get investmentValue() {
    return this._investmentValue
  }
}

export class SavedInvestment extends Investment {
  private readonly _id: string
  constructor(input: SavedInvestmentInput) {
    const { id, ...InvestmentInput } = input
    super(InvestmentInput)

    this._id = id
  }

  public get id(): string {
    return this._id
  }
}
