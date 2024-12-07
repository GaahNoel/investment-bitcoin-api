import { TokenCreator } from '@/domain/contracts/create-token.contract'
import { Mocked, vi } from 'vitest'

export function mockTokenCreator(): Mocked<TokenCreator> {
  return {
    create: vi.fn().mockResolvedValue('any-token'),
  }
}
