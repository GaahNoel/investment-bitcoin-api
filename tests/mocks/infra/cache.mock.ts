/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cache } from '@/infra/contracts/cache.contract'
import { Mocked, vi } from 'vitest'

export function mockCache(): Mocked<Cache> {
  return {
    get: <any>vi.fn(),
    save: vi.fn(),
  }
}
