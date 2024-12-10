import { Environment } from '@/domain/const/environment'
import { client } from '@/infra/repositories/prisma/config/connection'
import { env } from '@/main/config/env'
import { server } from '@/main/server'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('GetInvestmentPosition E2E', () => {
  beforeAll(async () => {
    env.SERVER_PORT = 3334
    env.ENV = Environment.Test

    await client.investment.deleteMany({
      where: {
        client: {
          email: {
            contains: 'test-',
          },
        },
      },
    })

    await client.client.deleteMany({
      where: {
        email: {
          contains: 'test-',
        },
      },
    })

    await server.inject({
      url: '/client/register',
      method: 'POST',
      body: {
        name: 'any-name',
        password: 'any-password',
        email: 'test-any@email.com',
        balance: 1000,
      },
    })
  })

  afterAll(async () => {
    await client.investment.deleteMany({
      where: {
        client: {
          email: {
            contains: 'test-',
          },
        },
      },
    })

    await client.client.deleteMany({
      where: {
        email: {
          contains: 'test-',
        },
      },
    })
  })

  it('should return correct investment position if called successfully', async () => {
    const login = await server.inject({
      url: '/client/login',
      method: 'POST',
      body: {
        password: 'any-password',
        email: 'test-any@email.com',
      },
    })

    await server.inject({
      url: '/client/buy-bitcoin',
      method: 'POST',
      headers: {
        authorization: `Bearer ${login.json().token}`,
      },
      body: {
        amount: 100,
      },
    })

    const investmentPosition = await server.inject({
      url: '/client/investments',
      method: 'GET',
      headers: {
        authorization: `Bearer ${login.json().token}`,
      },
    })

    expect(investmentPosition.json().length).toBe(1)
    expect(investmentPosition.json()[0]).toEqual({
      amount: 100,
      bitcoinPrice: 10,
      bitcoinVariationPercent: 50,
      grossCurrentInvestmentValue: 1500,
      investmentValue: 1000,
      orderDate: expect.anything(),
    })
  })
})
