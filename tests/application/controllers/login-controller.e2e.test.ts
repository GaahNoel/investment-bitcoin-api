import { WinstonLogger } from '@/infra/libs/winston-logger.lib'
import { RabbitMQQueue } from '@/infra/queue/rabbit-mq.queue'
import { client } from '@/infra/repositories/prisma/config/connection'
import { env } from '@/main/config/env'
import { server } from '@/main/server'
import { expect, beforeEach, describe, it, afterAll, beforeAll } from 'vitest'

describe('LoginController E2E', () => {
  const logger = new WinstonLogger()
  const queue = new RabbitMQQueue(env.RABBITMQ_URL, logger)

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

  afterAll(async () => {
    await queue.clearQueue('email')
  })

  it('should return token of logged user correctly', async () => {
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
      url: '/client/login',
      method: 'POST',
      body: {
        password: 'any-password',
        email: 'test-any@email.com',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().token).toBeDefined()
  })

  it('should bad request if some required param are missing', async () => {
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
      url: '/client/login',
      method: 'POST',
      body: {
        email: 'test-any@email.com',
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should bad request if invalid credentials are provided', async () => {
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
      url: '/client/login',
      method: 'POST',
      body: {
        email: 'test-any@email.com',
        password: 'any-wrong-password',
      },
    })

    expect(response.statusCode).toBe(400)
  })
})
