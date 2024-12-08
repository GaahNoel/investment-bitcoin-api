import { SendGridEmailSenderWorker } from '@/infra/workers/send-grid-email-sender.worker'
import { mockQueueConsumer } from '@/tests/mocks/infra/queue-consumer.mock'
import { beforeEach, describe, expect, vi, it, MockInstance } from 'vitest'
import sendGrid from '@sendgrid/mail'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'

describe('SendGridEmailSenderWorker', () => {
  let sut: SendGridEmailSenderWorker
  let sendSpy: MockInstance
  const queueConsumer = mockQueueConsumer({
    data: {
      email: 'any-email',
      subject: 'any-subject',
      text: 'any-text',
    },
  })

  beforeEach(() => {
    vi.spyOn(sendGrid, 'setApiKey').mockImplementation(vi.fn())

    sendSpy = vi.spyOn(sendGrid, 'send').mockImplementation(vi.fn().mockResolvedValue([{
      body: 'any-message',
      status: 202,
    }]))

    sut = new SendGridEmailSenderWorker(queueConsumer, mockLogger())
  })

  it('should call send grid with correct params', async () => {
    await sut.sendMail()

    expect(sendSpy).toHaveBeenCalledWith({
      from: 'any-sender',
      html: '<strong>any-text</strong>',
      subject: 'any-subject',
      text: 'any-text',
      to: 'any-email',
    })
  })
})
