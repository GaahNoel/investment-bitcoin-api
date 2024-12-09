import { Deposit, SavedDeposit } from '../entities/deposit'

export type SaveDepositRepositoryInput = Deposit

export interface SaveDepositRepository {
  save(input: SaveDepositRepositoryInput): Promise<SavedDeposit>
}
