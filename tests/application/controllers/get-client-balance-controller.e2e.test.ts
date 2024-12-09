import { client } from '@/infra/repositories/prisma/config/connection'
import { env } from '@/main/config/env'
import { server } from '@/main/server'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('GetClientBalance', () => {
  beforeAll(() => {
    env.SERVER_PORT = 3334
  })

  beforeEach(async () => {
    await client.client.deleteMany({
      where: {
        email: {
          contains: 'test-',
        },
      },
    })
  })

  it('should return client balance correctly if client exists', async () => {
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
      url: `/client/balance`,
      headers: {
        authorization: `Bearer ${login.json().token}`,
      },
      method: 'GET',
    })

    expect(response.json()).toEqual({
      balance: 10,
    })
  })

  it('should not allow not logger user', async () => {
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

    const response = await server.inject({
      url: `/client/balance`,
      method: 'GET',
    })

    expect(response.statusCode).toEqual(401)
  })
})
