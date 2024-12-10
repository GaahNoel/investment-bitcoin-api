import { SavedInvestment } from '../entities/investment'

export type ListInvestmentRepositoryInput = {
  id: string
}

export interface ListInvestmentRepository {
  list(input: ListInvestmentRepositoryInput): Promise<SavedInvestment[]>
}
