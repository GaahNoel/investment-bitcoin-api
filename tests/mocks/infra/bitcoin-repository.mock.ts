import { GetBitcoinPriceRepository } from '@/domain/contracts/get-bitcoin-price-repository'
import { Mocked, vi } from 'vitest'

export function mockGetBitcoinPrice(): Mocked<GetBitcoinPriceRepository> {
  return {
    get: vi.fn().mockResolvedValue({
      buy: 100,
      sell: 120,
    }),
  }
}
