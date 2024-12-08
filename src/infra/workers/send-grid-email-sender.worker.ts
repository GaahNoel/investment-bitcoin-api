import { ConsumeFromQueue } from '@/domain/contracts/consume-from-queue.contract'
import { Logger } from '@/domain/contracts/logger.contract'
import { MailSender, SendMailInput, SendMailOutput } from '@/domain/contracts/mail-sender.contract'
import { env } from '@/main/config/env'
import sendGrid from '@sendgrid/mail'

type Message = {
  data: SendMailInput
}

export class SendGridEmailSenderWorker implements MailSender {
  constructor(private readonly queueConsumer: ConsumeFromQueue, private readonly logger: Logger) {
    sendGrid.setApiKey(env.SEND_GRID_API_TOKEN)
  }

  async sendMail(): Promise<SendMailOutput> {
    await this.queueConsumer.consume({
      queue: 'email',
      callback: async (message: string): Promise<void> => {
        this.logger.info('Sending email')

        const { data } = JSON.parse(message) as Message

        const template = {
          to: data.email,
          from: env.SEND_GRID_SENDER,
          subject: data.subject,
          text: data.text,
          html: `<strong>${data.text}</strong>`,
        }

        const [response] = await sendGrid.send(template)

        this.logger.info('Email sent successfully', {
          body: response.body,
          status: response.statusCode,
        })
      },
    })

    return {
      success: true,
    }
  }
}
