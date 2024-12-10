import { SaveInvestmentRepository } from '@/domain/contracts/save-investment-repository.contract'
import { Mocked, vi } from 'vitest'
import { mockSavedInvestmentInput } from '../entities/investment'
import { SavedInvestment } from '@/domain/entities/investment'

export function mockSaveInvestmentRepository(): Mocked<SaveInvestmentRepository> {
  return {
    save: vi.fn().mockResolvedValue(new SavedInvestment(mockSavedInvestmentInput())),
  }
}
