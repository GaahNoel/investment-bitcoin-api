import { env } from '@/main/config/env'
import { server } from '@/main/server'
import { beforeAll, describe, expect, it } from 'vitest'

describe('GetBitcoinPriceController E2E', () => {
  beforeAll(() => {
    env.SERVER_PORT = 3334
  })

  it('should return the bitcoin price correctly', async () => {
    await server.inject({
      url: '/client/register',
      method: 'POST',
      body: {
        name: 'any-name',
        password: 'any-password',
        email: 'test-any@email.com',
        balance: 10,
      },
    })

    const login = await server.inject({
      url: '/client/login',
      method: 'POST',
      body: {
        password: 'any-password',
        email: 'test-any@email.com',
      },
    })

    const response = await server.inject({
      url: '/bitcoin',
      headers: {
        authorization: `Bearer ${login.json().token}`,
      },
    })

    const body = response.json()

    expect(response.statusCode).toBe(200)
    expect(body.buy).toBeDefined()
    expect(body.sell).toBeDefined()
  })
})
