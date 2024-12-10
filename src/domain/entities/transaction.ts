import { DateObject } from '../value-objects/date'

export enum TransactionType {
  Investment = 'investment',
  Deposit = 'deposit',
  Sell = 'sell',
}

export type TransactionInput = {
  amount: number
  date: DateObject
  clientId: string
}

export type TransactionOutput = {
  amount: number
  date: string
}

export abstract class Transaction {
  abstract readonly type: TransactionType
  private readonly _amount: number
  private readonly _date: DateObject
  private readonly _clientId: string

  constructor(input: TransactionInput) {
    this._amount = input.amount
    this._date = input.date
    this._clientId = input.clientId
  }

  public get amount() {
    return this._amount
  }

  public get date() {
    return this._date
  }

  public get clientId() {
    return this._clientId
  }

  public getDTO(): TransactionOutput {
    return {
      amount: this._amount,
      date: this.date.toShortString(),
    }
  }
}
