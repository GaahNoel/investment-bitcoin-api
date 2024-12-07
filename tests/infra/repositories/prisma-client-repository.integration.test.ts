import { ClientInput, SavedClient } from '@/domain/entities/client'
import { client } from '@/infra/repositories/prisma/config/connection'
import { PrismaClientRepository } from '@/infra/repositories/prisma/prisma-client.repository'
import { mockClientInput } from '@/tests/mocks/entities/client.mock'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { beforeEach, describe, expect, it } from 'vitest'

describe('PrismaClientRepository', () => {
  let sut: PrismaClientRepository
  let payload: ClientInput

  beforeEach(async () => {
    await client.client.deleteMany({})

    payload = mockClientInput()

    sut = new PrismaClientRepository(mockLogger())
  })

  describe('create', () => {
    it('should create a client successfully', async () => {
      const response = await sut.create(payload)

      expect(response).toBeInstanceOf(SavedClient)
      expect(response.id).toBeDefined()
    })

    it('should throw error if an client with same email exists', async () => {
      await sut.create(payload)

      const promise = sut.create(payload)

      expect(promise).rejects.toThrow()
    })
  })

  describe('find', () => {
    it('should find a client successfully', async () => {
      await sut.create(payload)

      const response = await sut.find({
        email: payload.email,
      })

      expect(response).toBeInstanceOf(SavedClient)
      expect(response?.id).toBeDefined()
    })

    it('should return undefined if client not found', async () => {
      await sut.create(payload)

      const response = await sut.find({
        email: 'other-email',
      })

      expect(response).toBeUndefined()
    })
  })
})