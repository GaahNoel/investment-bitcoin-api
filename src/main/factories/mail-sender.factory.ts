import { FakeMailSender } from '@/fakes/mail-sender.fake'
import { env } from '../config/env'
import { SendGridEmailSenderWorker } from '@/infra/workers/send-grid-email-sender.worker'
import { RabbitMQQueue } from '@/infra/queue/rabbit-mq.queue'
import { WinstonLogger } from '@/infra/libs/winston-logger.lib'

export class MailSenderFactory {
  static make() {
    const winstonLogger = new WinstonLogger()

    const rabbitmq = new RabbitMQQueue(env.RABBITMQ_URL, winstonLogger)

    if (env.ENV === 'test') {
      return new FakeMailSender(rabbitmq, winstonLogger)
    }

    return new SendGridEmailSenderWorker(rabbitmq, winstonLogger)
  }
}
