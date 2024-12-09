import { env } from '@/main/config/env'
import { server } from '@/main/server'
import { beforeAll, describe, expect, it } from 'vitest'

describe('GetBitcoinPriceController E2E', () => {
  beforeAll(() => {
    env.SERVER_PORT = 3334
  })

  it('should return the bitcoin price correctly', async () => {
    const response = await server.inject({
      url: '/bitcoin',
    })

    const body = response.json()

    expect(response.statusCode).toBe(200)
    expect(body.buy).toBeDefined()
    expect(body.sell).toBeDefined()
  })
})
