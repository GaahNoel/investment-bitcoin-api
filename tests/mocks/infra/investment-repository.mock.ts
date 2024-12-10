import { SaveInvestmentRepository } from '@/domain/contracts/save-investment-repository.contract'
import { Mocked, vi } from 'vitest'
import { mockSavedInvestmentInput } from '../entities/investment'
import { SavedInvestment } from '@/domain/entities/investment'
import { ListInvestmentRepository } from '@/domain/contracts/list-investment-repository.contract'
import { DateObject } from '@/domain/value-objects/date'

export function mockSaveInvestmentRepository(): Mocked<SaveInvestmentRepository> {
  return {
    save: vi.fn().mockResolvedValue(new SavedInvestment(mockSavedInvestmentInput())),
  }
}

export function mockListInvestmentRepository(): Mocked<ListInvestmentRepository> {
  return {
    list: vi.fn().mockResolvedValue([
      new SavedInvestment(mockSavedInvestmentInput()),
      new SavedInvestment(mockSavedInvestmentInput({
        investmentValue: 5,
        amount: 15,
        bitcoinPrice: 25,
        date: new DateObject('2024-03-02'),
      })),
      new SavedInvestment(mockSavedInvestmentInput({
        investmentValue: 5,
        amount: 15,
        bitcoinPrice: 2,
        date: new DateObject('2024-02-21'),
      })),
    ]),
  }
}
