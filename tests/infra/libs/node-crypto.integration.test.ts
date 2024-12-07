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
      const response = sut.encrypt(payload)

      expect(response).not.toEqual(payload)
    })
  })

  describe('compare', () => {
    it('should return true if two equal information was provided', () => {
      const encryptedValue = sut.encrypt(payload)

      const isEqual = sut.compare(encryptedValue, payload)

      expect(isEqual).toBe(true)
    })

    it('should return false if two different information was provided', () => {
      const encryptedValue = sut.encrypt('other-value-to-encrypt')

      const isEqual = sut.compare(encryptedValue, payload)

      expect(isEqual).toBe(false)
    })
  })
})
