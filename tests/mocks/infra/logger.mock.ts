import { Logger } from '@/domain/contracts/logger.contract'
import { Mocked, vi } from 'vitest'

export const mockLogger = (): Mocked<Logger> => {
  return {
    info: vi.fn(),
    error: vi.fn(),
  }
}
