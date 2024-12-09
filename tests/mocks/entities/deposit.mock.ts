import { DepositInput } from '@/domain/entities/deposit'
import { DateObject } from '@/domain/value-objects/date'

export function mockDepositInput(params: Partial<DepositInput> = {}): DepositInput {
  return {
    amount: 100,
    clientId: 'any-id',
    date: new DateObject('2024-01-01'),
    ...params,
  }
}
