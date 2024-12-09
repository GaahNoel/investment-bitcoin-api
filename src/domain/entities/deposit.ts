import { Transaction, TransactionInput, TransactionType } from './transaction'

export type DepositInput = TransactionInput

export type SavedDepositInput = DepositInput & {
  id: string
}

export class Deposit extends Transaction {
  readonly type = TransactionType.Deposit
}

export class SavedDeposit extends Deposit {
  private readonly _id: string
  constructor(input: SavedDepositInput) {
    const { id, ...depositInput } = input
    super(depositInput)

    this._id = id
  }

  public get id(): string {
    return this._id
  }
}
