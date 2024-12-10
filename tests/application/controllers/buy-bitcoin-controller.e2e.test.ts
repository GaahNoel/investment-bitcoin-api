import { Environment } from '@/domain/const/environment'
import { SavedClientDTO } from '@/domain/entities/client'
import { client } from '@/infra/repositories/prisma/config/connection'
import { env } from '@/main/config/env'
import { server } from '@/main/server'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('BuyBitcoinController E2E', () => {
  let createdClient: SavedClientDTO
  const mockedJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

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

    const response = await server.inject({
      url: '/client/register',
      method: 'POST',
      body: {
        name: 'any-name',
        password: 'any-password',
        email: 'test-any@email.com',
        balance: 1000,
      },
    })

    createdClient = response.json()
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

  it('should not allow user with invalid jwt to buy bit coin', async () => {
    const response = await server.inject({
      url: '/client/buy-bitcoin',
      method: 'POST',
      headers: {
        authorization: `Bearer ${mockedJWT}`,
      },
      body: {
        amount: 100,
      },
    })

    expect(response.statusCode).toBe(401)
  })

  it('should not allow not logged user to buy bit coin', async () => {
    const response = await server.inject({
      url: '/client/buy-bitcoin',
      method: 'POST',
      body: {
        amount: 100,
      },
    })

    expect(response.statusCode).toBe(401)
  })

  it('should buy bitcoin amount provided if client have the correct balance', async () => {
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

    const foundInvestment = await client.investment.findFirst({
      include: {
        client: true,
      },
      where: {
        clientId: createdClient.id,
      },
    })

    const finalClientBalance = foundInvestment?.client.balance
    expect(finalClientBalance).toBe(0)
    expect(foundInvestment?.investmentValue).toBe(1000)
  })

  it('should not buy some amount lower than zero', async () => {
    const login = await server.inject({
      url: '/client/login',
      method: 'POST',
      body: {
        password: 'any-password',
        email: 'any@email.com',
      },
    })

    const response = await server.inject({
      url: '/client/buy-bitcoin',
      method: 'POST',
      headers: {
        authorization: `Bearer ${login.json().token}`,
      },
      body: {
        amount: -100,
      },
    })

    expect(response.statusCode).toBe(400)
  })
})
