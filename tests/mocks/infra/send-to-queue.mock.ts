import { SendToQueue } from '@/domain/contracts/send-to-queue.contract'
import { Mocked, vi } from 'vitest'

export function mockSendToQueue(): Mocked<SendToQueue> {
  return {
    send: vi.fn().mockResolvedValue({
      success: true,
    }),
  }
}
