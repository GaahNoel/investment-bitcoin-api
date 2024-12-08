import { SavedClientDTO } from '@/domain/entities/client'
import { client } from '@/infra/repositories/prisma/config/connection'
import { clients } from '@/main/routes/clients'
import fastify from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('DepositController E2E', () => {
  let createdClient: SavedClientDTO
  const mockedJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  const server = fastify()
  server.register(clients)

  afterAll(async () => {
    await client.client.deleteMany({})
  })

  beforeAll(async () => {
    const response = await server.inject({
      url: '/register',
      method: 'POST',
      body: {
        name: 'any-name',
        password: 'any-password',
        email: 'any@email.com',
        balance: 10,
      },
    })

    createdClient = response.json()
  })

  it('should not permit user with invalid jwt', async () => {
    const response = await server.inject({
      url: '/deposit',
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

  it('should not permit not logged user', async () => {
    const response = await server.inject({
      url: '/deposit',
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
      url: '/login',
      method: 'POST',
      body: {
        password: 'any-password',
        email: 'any@email.com',
      },
    })

    await server.inject({
      url: '/deposit',
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${login.json().token}`,
      },
      body: {
        amount: 100,
      },
    })

    const foundClient = await client.client.findFirst({
      where: {
        id: createdClient.id,
      },
    })

    const initialClientBalance = foundInitialClient?.balanceInCents as number
    const finalClientBalance = foundClient?.balanceInCents

    expect(initialClientBalance).not.toBe(finalClientBalance)
    expect(finalClientBalance).toBe(initialClientBalance + 100)
  })

  it('should not deposit some amount lower than zero', async () => {
    const login = await server.inject({
      url: '/login',
      method: 'POST',
      body: {
        password: 'any-password',
        email: 'any@email.com',
      },
    })

    const response = await server.inject({
      url: '/deposit',
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
