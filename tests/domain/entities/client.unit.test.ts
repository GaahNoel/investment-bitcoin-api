import { Client, ClientInput } from '@/domain/entities/client'
import { InvalidInputError } from '@/domain/errors/invalid-input.error'
import { mockClientInput } from '@/tests/mocks/entities/client.mock'
import { describe, expect, it, beforeEach } from 'vitest'

describe('Client Entity', () => {
  let input: ClientInput

  beforeEach(() => {
    input = mockClientInput()
  })

  describe('constructor', () => {
    it('should create Client with correctly input', () => {
      const client = new Client(input)

      expect(client.balance).toBe(input.balance)
      expect(client.name).toBe(input.name)
      expect(client.email).toBe(input.email)
    })

    it('should create Client with correctly input and with balance 0 if not provided', () => {
      const client = new Client({
        ...input,
        balance: undefined,
      })

      expect(client.balance).toBe(0)
      expect(client.name).toBe(input.name)
      expect(client.email).toBe(input.email)
    })

    it('should throw error if amount provided is lower than zero', () => {
      expect(() => new Client({
        ...input,
        balance: -1,
      })).toThrow(InvalidInputError)
    })
  })

  describe('addBalance', () => {
    it('should add balance correctly if is greater than zero', () => {
      const client = new Client(input)

      client.addBalance(100)

      expect(client.balance).toBe(200)
    })

    it('should throw error if balance provided is lower than zero', () => {
      const client = new Client(input)

      expect(() => client.addBalance(-100)).toThrow()
    })
  })

  describe('subtractBalance', () => {
    it('should subtract balance correctly if is greater than zero', () => {
      const client = new Client(input)

      client.subtractBalance(100)

      expect(client.balance).toBe(0)
    })

    it('should not subtract balance if provided amount is higher than client balance', () => {
      const client = new Client(input)

      expect(() => client.subtractBalance(1000)).toThrow()
    })

    it('should throw error if balance provided is lower than zero', () => {
      const client = new Client(input)

      expect(() => client.subtractBalance(-100)).toThrow()
    })
  })
})
