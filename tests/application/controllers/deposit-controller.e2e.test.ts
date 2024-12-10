import { SavedClientDTO } from '@/domain/entities/client'
import { client } from '@/infra/repositories/prisma/config/connection'
import { env } from '@/main/config/env'
import { server } from '@/main/server'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('DepositController E2E', () => {
  let createdClient: SavedClientDTO
  const mockedJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  beforeAll(async () => {
    env.SERVER_PORT = 3334

    await client.deposit.deleteMany({
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
        balance: 10,
      },
    })

    createdClient = response.json()
  })

  afterAll(async () => {
    await client.deposit.deleteMany({
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

  it('should not allow user with invalid jwt', async () => {
    const response = await server.inject({
      url: '/client/deposit',
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${mockedJWT}`,
      },
      body: {
        amount: 100,
      },
    })

    expect(response.statusCode).toBe(401)
  })

  it('should not allow not logged user', async () => {
    const response = await server.inject({
      url: '/client/deposit',
      method: 'PATCH',
      body: {
        amount: 100,
      },
    })

    expect(response.statusCode).toBe(401)
  })

  it('should deposit some amount to the client account', async () => {
    const foundInitialClient = await client.client.findFirst({
      where: {
        id: createdClient.id,
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

    await server.inject({
      url: '/client/deposit',
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${login.json().token}`,
      },
      body: {
        amount: 100,
      },
    })

    const foundClient = await client.deposit.findFirst({
      include: {
        client: true,
      },
      where: {
        clientId: createdClient.id,
      },
    })

    const initialClientBalance = foundInitialClient?.balance as number
    const finalClientBalance = foundClient?.client.balance

    expect(foundClient?.value).toBe(100)
    expect(initialClientBalance).not.toBe(finalClientBalance)
    expect(finalClientBalance).toBe(initialClientBalance + 100)
  })

  it('should not deposit some amount lower than zero', async () => {
    const login = await server.inject({
      url: '/client/login',
      method: 'POST',
      body: {
        password: 'any-password',
        email: 'any@email.com',
      },
    })

    const response = await server.inject({
      url: '/client/deposit',
      method: 'PATCH',
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
