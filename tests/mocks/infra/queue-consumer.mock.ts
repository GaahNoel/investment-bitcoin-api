import { ConsumeFromQueue } from '@/domain/contracts/consume-from-queue.contract'
import { Mocked, vi } from 'vitest'

export function mockQueueConsumer(message: Record<string, unknown>): Mocked<ConsumeFromQueue> {
  return {
    consume: vi.fn().mockImplementation((params) => {
      params.callback(JSON.stringify(message))
    }),
  }
}
