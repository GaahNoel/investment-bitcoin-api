import { RabbitMQQueue } from '@/infra/queue/rabbit-mq.queue'
import { env } from '@/main/config/env'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

describe('RabbitMQQueue', () => {
  let sut: RabbitMQQueue

  beforeEach(() => {
    sut = new RabbitMQQueue(env.RABBITMQ_URL, mockLogger())
  })

  afterAll(async () => {
    await sut.clearQueue('test')
  })

  it('should send message to queue correctly', async () => {
    const response = await sut.send({
      queue: 'test',
      data: {
        any: 'message',
      },
    })

    expect(response).toBe(true)
  })

  it('should consume message correctly', async () => {
    await sut.send({
      queue: 'email',
      data: {
        any: 'message',
      },
    })

    const promise = sut.consume({
      callback: async () => {
        return
      },
      queue: 'email',
    })

    await expect(promise).resolves.not.toThrow
  })
})
