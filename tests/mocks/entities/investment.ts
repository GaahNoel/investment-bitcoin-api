import { InvestmentInput, SavedInvestmentInput } from '@/domain/entities/investment'
import { DateObject } from '@/domain/value-objects/date'

export function mockInvestmentInput(params: Partial<InvestmentInput> = {}): InvestmentInput {
  return {
    amount: 100,
    bitcoinPrice: 10,
    clientId: 'any-id',
    date: new DateObject('2024-01-01'),
    investmentValue: 1000,
    ...params,
  }
}

export function mockSavedInvestmentInput(params: Partial<InvestmentInput> = {}): SavedInvestmentInput {
  return {
    ...mockInvestmentInput(),
    id: 'any-investment-id',
    ...params,
  }
}
