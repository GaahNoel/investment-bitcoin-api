import { ConsumeFromQueue, ConsumeFromQueueInput } from '@/domain/contracts/consume-from-queue.contract'
import { Logger } from '@/domain/contracts/logger.contract'
import { SendToQueue, SendToQueueInput } from '@/domain/contracts/send-to-queue.contract'
import amqp, { Channel, Connection } from 'amqplib'

export class RabbitMQQueue implements SendToQueue, ConsumeFromQueue {
  private connection?: Connection
  private channel?: Channel

  constructor(private readonly url: string, private readonly logger: Logger) {}

  async createConnection() {
    try {
      this.logger.info('Creating connection with RabbitMQ')

      this.connection = await amqp.connect(this.url)
      this.channel = await this.connection.createChannel()

      this.logger.info('Connection successfully created')
    }
    catch (error) {
      this.logger.error('Cannot establish connection with the RabbitMQ')
      throw error
    }
  }

  async send(input: SendToQueueInput): Promise<boolean> {
    if (this.channel === undefined) {
      await this.createConnection()
    }

    if (!this.channel) {
      throw new Error('Cannot establish connection with the RabbitMQ')
    }

    await this.channel.assertQueue(input.queue, { durable: true })
    const response = await this.channel.sendToQueue(input.queue, Buffer.from(JSON.stringify(input)), { persistent: true })

    return Boolean(response)
  }

  async consume({ callback, queue }: ConsumeFromQueueInput): Promise<void> {
    if (this.channel === undefined) {
      await this.createConnection()
    }

    if (!this.channel) {
      throw new Error('Cannot establish connection with the RabbitMQ')
    }

    await this.channel.assertQueue(queue, { durable: true })
    const channel = this.channel

    await this.channel.consume(queue, async (message) => {
      if (message) {
        await callback(message.content.toString())
        channel.ack(message)
      }
    })
  }

  async clearQueue(queueName: string): Promise<void> {
    if (this.channel === undefined) {
      await this.createConnection()
    }

    if (!this.channel) {
      throw new Error('Cannot establish connection with the RabbitMQ')
    }

    await this.channel.assertQueue(queueName, { durable: true })
    await this.channel.purgeQueue(queueName)
  }
}
