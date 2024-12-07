import { NodeCrypto } from '@/infra/libs/node-crypto.lib'
import { expect, beforeEach, describe, it } from 'vitest'

describe('NodeCrypto', () => {
  let sut: NodeCrypto
  let payload: string

  beforeEach(() => {
    payload = 'value-to-encrypt'

    sut = new NodeCrypto()
  })

  describe('encrypt', () => {
    it('should encrypt a string correctly', () => {
      const response = sut.encypt(payload)

      expect(response).not.toEqual(payload)
      expect(response.length).toBe(64)
    })
  })
})
