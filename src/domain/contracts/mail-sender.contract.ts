export type SendMailInput = {
  email: string
  subject: string
  text: string
}

export type SendMailOutput = {
  success: boolean
}

export interface MailSender {
  sendMail(input: SendMailInput): Promise<SendMailOutput>
}
