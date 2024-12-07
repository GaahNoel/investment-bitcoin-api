import { client } from '@/infra/repositories/prisma/config/connection'
import { clients } from '@/main/routes/clients'
import fastify from 'fastify'
import { expect, beforeEach, describe, it } from 'vitest'

describe('LoginController E2E', () => {
  const server = fastify()
  server.register(clients)

  beforeEach(async () => {
    await client.client.deleteMany({})
  })

  it('should return token of logged user correctly', async () => {
    await server.inject({
      url: '/register',
      method: 'POST',
      body: {
        name: 'any-name',
        password: 'any-password',
        email: 'any@email.com',
        balance: 10,
      },
    })

    const response = await server.inject({
      url: '/login',
      method: 'POST',
      body: {
        password: 'any-password',
        email: 'any@email.com',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().token).toBeDefined()
  })

  it('should bad request if some required param are missing', async () => {
    await server.inject({
      url: '/register',
      method: 'POST',
      body: {
        name: 'any-name',
        password: 'any-password',
        email: 'any@email.com',
        balance: 10,
      },
    })

    const response = await server.inject({
      url: '/login',
      method: 'POST',
      body: {
        email: 'any@email.com',
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should bad request if invalid credentials are provided', async () => {
    await server.inject({
      url: '/register',
      method: 'POST',
      body: {
        name: 'any-name',
        password: 'any-password',
        email: 'any@email.com',
        balance: 10,
      },
    })

    const response = await server.inject({
      url: '/login',
      method: 'POST',
      body: {
        email: 'any@email.com',
        password: 'any-wrong-password',
      },
    })

    expect(response.statusCode).toBe(400)
  })
})
