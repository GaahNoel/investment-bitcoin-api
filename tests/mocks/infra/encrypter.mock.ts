import { Encrypter, HashComparer } from '@/domain/contracts/encrypter.contract'
import { Mocked, vi } from 'vitest'

export const mockEncrypter = (): Mocked<Encrypter> => {
  return {
    encrypt: vi.fn().mockReturnValue('encrypted-value'),
  }
}

export const mockHashComparer = (): Mocked<HashComparer> => {
  return {
    compare: vi.fn().mockReturnValue(true),
  }
}
