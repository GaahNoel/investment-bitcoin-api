import { GetInvestmentPositionInput } from '@/domain/contracts/get-investment-position.contract'
import { GetInvestmentPositionUseCase } from '@/domain/usecases/get-investment-position.usecase'
import { mockGetBitcoinPrice } from '@/tests/mocks/infra/bitcoin-repository.mock'
import { mockListInvestmentRepository } from '@/tests/mocks/infra/investment-repository.mock'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { describe, expect, vi, beforeEach, it } from 'vitest'

describe('GetInvestmentPositionUseCase', () => {
  let sut: GetInvestmentPositionUseCase
  const logger = mockLogger()
  const getBitcoinPrice = mockGetBitcoinPrice()
  const listInvestmentRepository = mockListInvestmentRepository()
  let payload: GetInvestmentPositionInput

  beforeEach(() => {
    vi.clearAllMocks()

    payload = {
      id: 'any-id',
    }

    sut = new GetInvestmentPositionUseCase(listInvestmentRepository, getBitcoinPrice, logger)
  })

  it('should call dependencies with correct params', async () => {
    await sut.handle(payload)

    expect(listInvestmentRepository.list).toHaveBeenCalledWith({
      id: payload.id,
    })

    expect(getBitcoinPrice.get).toHaveBeenCalledTimes(1)
  })

  it('should throw error if no investments were found', async () => {
    listInvestmentRepository.list.mockResolvedValueOnce([])

    const promise = sut.handle(payload)

    await expect(promise).rejects.toThrow()
  })

  it('should map investments correctly using bitcoin current price', async () => {
    const response = await sut.handle(payload)

    expect(response).toEqual([{
      amount: 100,
      bitcoinPrice: 10,
      bitcoinVariationPercent: 1100,
      grossCurrentInvestmentValue: 12000,
      investmentValue: 1000,
      orderDate: '2024-01-01',
    },
    {
      amount: 15,
      bitcoinPrice: 25,
      bitcoinVariationPercent: 380,
      grossCurrentInvestmentValue: 1800,
      investmentValue: 5,
      orderDate: '2024-03-02',
    },
    {
      amount: 15,
      bitcoinPrice: 2,
      bitcoinVariationPercent: 5900,
      grossCurrentInvestmentValue: 1800,
      investmentValue: 5,
      orderDate: '2024-02-21',
    },
    ])
  })
})
