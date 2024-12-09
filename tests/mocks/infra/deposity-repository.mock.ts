import { SaveDepositRepository } from '@/domain/contracts/save-deposit-repository.contract'
import { SavedDeposit } from '@/domain/entities/deposit'
import { DateObject } from '@/domain/value-objects/date'
import { Mocked, vi } from 'vitest'

export function mockSaveDepositRepository(): Mocked<SaveDepositRepository> {
  return {
    save: vi.fn().mockResolvedValue(new SavedDeposit({
      amount: 100,
      date: new DateObject('2024-01-01'),
      id: 'any-deposit-id',
      clientId: 'any-id',
    })),
  }
}
