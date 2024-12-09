import { RabbitMQQueue } from '@/infra/queue/rabbit-mq.queue'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import amqplib from 'amqplib'
import { SendToQueueInput } from '@/domain/contracts/send-to-queue.contract'
import { ConsumeFromQueueInput } from '@/domain/contracts/consume-from-queue.contract'

vi.mock('amqplib')

describe('RabbitMQQueue', () => {
  let sut: RabbitMQQueue
  const logger = mockLogger()
  let connectMock: Mock
  let createChannelMock: Mock
  let ackMock: Mock
  let consumeMock: Mock
  let sendToQueueMock: Mock
  let assertMock: Mock
  let purgeMock: Mock

  beforeAll(() => {
    ackMock = vi.fn()
    assertMock = vi.fn()
    sendToQueueMock = vi.fn()
    consumeMock = vi.fn()
    purgeMock = vi.fn()

    createChannelMock = vi.fn().mockResolvedValue({
      ack: ackMock,
      assertQueue: assertMock,
      sendToQueue: sendToQueueMock,
      consume: consumeMock,
      purgeQueue: purgeMock,
    })

    connectMock = vi.fn().mockResolvedValue({
      createChannel: createChannelMock,
    })

    amqplib.connect = connectMock
  })

  beforeEach(() => {
    vi.clearAllMocks()

    sut = new RabbitMQQueue('any-url', logger)
  })

  describe('createConnection', () => {
    it('should not throw error if connection established successfully', async () => {
      await expect(sut.createConnection()).resolves.not.toThrow()
    })

    it('should throw error if connection cannot be established', async () => {
      connectMock.mockRejectedValueOnce(new Error())

      await expect(sut.createConnection()).rejects.toThrow()
    })
  })

  describe('send', () => {
    let payload: SendToQueueInput

    beforeEach(() => {
      payload = {
        data: {
          any: 'data',
        },
        queue: 'test',
      }
    })

    it('should throw error if channel is not initialized', async () => {
      createChannelMock.mockResolvedValueOnce(undefined)

      await expect(sut.send(payload)).rejects.toThrow()
    })
    it('should call send to queue correctly if connection established correctly', async () => {
      await expect(sut.send(payload)).resolves.not.toThrow()

      expect(sendToQueueMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('consume', () => {
    let payload: ConsumeFromQueueInput

    beforeEach(() => {
      payload = {
        callback: async () => {},
        queue: 'test',
      }
    })

    it('should throw error if channel is not initialized', async () => {
      createChannelMock.mockResolvedValueOnce(undefined)

      await expect(sut.consume(payload)).rejects.toThrow()
    })
    it('should call consume to queue correctly if connection established correctly', async () => {
      await expect(sut.consume(payload)).resolves.not.toThrow()

      expect(consumeMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('clearQueue', () => {
    let queueName: string

    beforeEach(() => {
      queueName = 'test'
    })

    it('should throw error if channel is not initialized', async () => {
      createChannelMock.mockResolvedValueOnce(undefined)

      await expect(sut.clearQueue(queueName)).rejects.toThrow()
    })
    it('should call consume to queue correctly if connection established correctly', async () => {
      await expect(sut.clearQueue(queueName)).resolves.not.toThrow()

      expect(purgeMock).toHaveBeenCalledTimes(1)
    })
  })
})
