import { Environment } from '@/domain/const/environment'
import { WinstonLogger } from '@/infra/libs/winston-logger.lib'
import { RabbitMQQueue } from '@/infra/queue/rabbit-mq.queue'
import { client } from '@/infra/repositories/prisma/config/connection'
import { env } from '@/main/config/env'
import { server } from '@/main/server'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('Register Controller E2E', () => {
  const logger = new WinstonLogger()
  const queue = new RabbitMQQueue(env.RABBITMQ_URL, logger)

  beforeAll(() => {
    env.ENV = Environment.Test
    
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

  it('should return created and client infos if client created successfully', async () => {
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

    const body = response.json()

    const savedClient = await client.client.findFirst({
      where: {
        id: body.id,
      },
    })

    expect(response.statusCode).toBe(201)
    expect(savedClient).not.toBeUndefined()
  })

  it('should return bad request error if client already created', async () => {
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
      url: '/client/register',
      method: 'POST',
      body: {
        name: 'any-name',
        password: 'any-password',
        email: 'test-any@email.com',
        balance: 10,
      },
    })

    const savedClient = await client.client.findFirst({
      where: {
        id: response.json().id,
      },
    })

    expect(response.statusCode).toBe(400)
    expect(savedClient).not.toBeUndefined()
  })
})
