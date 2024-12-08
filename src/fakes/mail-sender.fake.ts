import { MailSender, SendMailOutput } from '@/domain/contracts/mail-sender.contract'

export class FakeMailSender implements MailSender {
  async sendMail(): Promise<SendMailOutput> {
    return {
      success: true,
    }
  }
}
