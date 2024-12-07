import { Encrypter } from '@/domain/contracts/encrypter.contract'
import { Mocked, vi } from 'vitest'

export const mockEncrypter = (): Mocked<Encrypter> => {
  return {
    encypt: vi.fn().mockReturnValue('encrypted-value'),
  }
}
