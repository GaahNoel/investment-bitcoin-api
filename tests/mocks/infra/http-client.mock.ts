import { HttpGetClient } from '@/infra/contracts/http-client.contract'
import { Mocked, vi } from 'vitest'

export function mockHttpGetClient<T>(response: T): Mocked<HttpGetClient> {
  return {
    get: vi.fn().mockResolvedValue(response),
  }
}
