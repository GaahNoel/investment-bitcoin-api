import { Investment, SavedInvestment } from '../entities/investment'

export type SaveInvestmentRepositoryInput = Investment

export interface SaveInvestmentRepository {
  save(input: SaveInvestmentRepositoryInput): Promise<SavedInvestment>
}
