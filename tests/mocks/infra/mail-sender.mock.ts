import { MailSender } from '@/domain/contracts/mail-sender.contract'
import { Mocked, vi } from 'vitest'

export function mockMailSender(): Mocked<MailSender> {
  return {
    sendMail: vi.fn().mockResolvedValue({
      success: true,
    }),
  }
}
