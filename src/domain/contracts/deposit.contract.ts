export type DepositInput = {
  id: string
  amount: number
}

export interface Deposit {
  handle(input: DepositInput): Promise<void>
}
