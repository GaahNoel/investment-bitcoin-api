import { WinstonLogger } from '@/infra/libs/winston-logger.lib'
import { RabbitMQQueue } from '@/infra/queue/rabbit-mq.queue'
import { client } from '@/infra/repositories/prisma/config/connection'
import { env } from '@/main/config/env'
import { clients } from '@/main/routes/clients'
import fastify from 'fastify'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

describe('Register Controller E2E', () => {
  const server = fastify()
  server.register(clients)
  const logger = new WinstonLogger()
  const queue = new RabbitMQQueue(env.RABBITMQ_URL, logger)

  beforeEach(async () => {
    await client.client.deleteMany({})
  })

  afterAll(async () => {
    await queue.clearQueue('email')
  })

  it('should return created and client infos if client created successfully', async () => {
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

    const savedClient = await client.client.findFirst({
      where: {
        id: response.json().id,
      },
    })

    expect(response.statusCode).toBe(201)
    expect(savedClient).not.toBeUndefined()
  })

  it('should return bad request error if client already created', async () => {
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
      url: '/register',
      method: 'POST',
      body: {
        name: 'any-name',
        password: 'any-password',
        email: 'any@email.com',
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
