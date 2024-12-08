import { ConsumeFromQueue } from '@/domain/contracts/consume-from-queue.contract'
import { Logger } from '@/domain/contracts/logger.contract'
import { MailSender, SendMailOutput } from '@/domain/contracts/mail-sender.contract'

export class FakeMailSender implements MailSender {
  constructor(private readonly queueConsumer: ConsumeFromQueue, private readonly logger: Logger) {}
  async sendMail(): Promise<SendMailOutput> {
    await this.queueConsumer.consume({
      queue: 'email',
      callback: async (): Promise<void> => {
        this.logger.info('Fake mail sender called successfully')
      },
    })

    return {
      success: true,
    }
  }
}
