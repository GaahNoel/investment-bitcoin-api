import { GetBitcoinPriceUseCase } from '@/domain/usecases/get-bitcoin-price.usecase'
import { mockGetBitcoinPrice } from '@/tests/mocks/infra/bitcoin-repository.mock'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { expect, vi, beforeEach, describe, it } from 'vitest'

describe('GetBitcoinPriceUseCase', () => {
  let sut: GetBitcoinPriceUseCase
  const getBitcoinPriceRepository = mockGetBitcoinPrice()

  beforeEach(() => {
    vi.clearAllMocks()

    sut = new GetBitcoinPriceUseCase(getBitcoinPriceRepository, mockLogger())
  })

  it('should call get bitcoin price repository correctly', async () => {
    await sut.handle()

    expect(getBitcoinPriceRepository.get).toHaveBeenCalledTimes(1)
  })

  it('should return found bitcoin price correctly', async () => {
    const response = await sut.handle()

    expect(response).toEqual({
      buy: 100,
      sell: 120,
    })
  })
})
