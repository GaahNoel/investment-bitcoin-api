import { BitcoinAPI } from '@/infra/api/bitcoin.api'
import { env } from '@/main/config/env'
import { mockCache } from '@/tests/mocks/infra/cache.mock'
import { mockHttpGetClient } from '@/tests/mocks/infra/http-client.mock'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { describe, expect, beforeEach, it, beforeAll, vi } from 'vitest'

describe('BitcoinAPI', () => {
  let sut: BitcoinAPI
  const cache = mockCache()
  const httpGetClient = mockHttpGetClient({
    ticker: {
      high: '620850.77000000',
      low: '606796.30000000',
      vol: '26.51686984',
      last: '613668.62507923',
      buy: '613336.08017057',
      sell: '613788.49436279',
      open: '613852.21999997',
      date: 1733710289,
      pair: 'BRLBTC',
    },
  })

  beforeAll(() => {
    env.BITCOIN_API_URL = 'any-url'
  })

  beforeEach(() => {
    vi.clearAllMocks()

    sut = new BitcoinAPI(httpGetClient, cache, mockLogger())
  })

  it('should call http get client with correct url, save on cache and return the mapped response', async () => {
    const response = await sut.get()

    expect(httpGetClient.get).toHaveBeenCalledWith({
      url: 'any-url/api/BTC/ticker/',
    })

    expect(cache.save).toHaveBeenCalledWith({
      key: 'bitcoin-api',
      expirationInSeconds: 3.6,
      value: {
        ticker: {
          high: '620850.77000000',
          low: '606796.30000000',
          vol: '26.51686984',
          last: '613668.62507923',
          buy: '613336.08017057',
          sell: '613788.49436279',
          open: '613852.21999997',
          date: 1733710289,
          pair: 'BRLBTC',
        },
      },
    })

    expect(response).toEqual({
      buy: 613336.08017057,
      sell: 613788.49436279,
    })
  })

  it('should return cached response', async () => {
    cache.get.mockResolvedValueOnce({
      ticker: {
        high: '620850.77000000',
        low: '606796.30000000',
        vol: '26.51686984',
        last: '613668.62507923',
        buy: '613336.08017057',
        sell: '613788.49436279',
        open: '613852.21999997',
        date: 1733710289,
        pair: 'BRLBTC',
      },
    })

    const response = await sut.get()

    expect(httpGetClient.get).not.toHaveBeenCalled()

    expect(response).toEqual({
      buy: 613336.08017057,
      sell: 613788.49436279,
    })
  })
})
