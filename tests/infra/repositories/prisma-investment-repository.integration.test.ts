import { SavedClient } from '@/domain/entities/client'
import { Investment, SavedInvestment } from '@/domain/entities/investment'
import { client } from '@/infra/repositories/prisma/config/connection'
import { PrismaClientRepository } from '@/infra/repositories/prisma/prisma-client.repository'
import { PrismaInvestmentRepository } from '@/infra/repositories/prisma/prisma-investment.repository'
import { mockClientInput } from '@/tests/mocks/entities/client.mock'
import { mockInvestmentInput } from '@/tests/mocks/entities/investment'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'

import { describe, expect, beforeEach, it, beforeAll, afterAll } from 'vitest'

describe('PrismaInvestmentRepository', () => {
  let sut: PrismaInvestmentRepository
  const logger = mockLogger()
  const clientRepository = new PrismaClientRepository(logger)
  let createdClient: SavedClient

  beforeAll(async () => {
    await client.client.deleteMany({
      where: {
        email: {
          contains: 'test-',
        },
      },
    })

    createdClient = await clientRepository.create(mockClientInput())
  })

  beforeEach(() => {
    sut = new PrismaInvestmentRepository(logger)
  })

  afterAll(async () => {
    await client.investment.deleteMany({
      where: {
        client: {
          email: {
            contains: 'test-',
          },
        },
      },
    })

    await client.client.deleteMany({
      where: {
        email: {
          contains: 'test-',
        },
      },
    })
  })

  describe('save', () => {
    let payload: Investment

    beforeEach(() => {
      payload = new Investment(mockInvestmentInput({
        clientId: createdClient.id,
      }))
    })
    it('should save investment successfully', async () => {
      const response = await sut.save(payload)

      expect(response).toBeInstanceOf(SavedInvestment)
      expect(response.id).toBeDefined()
    })
  })

  describe('list', () => {
    let payload: Investment

    beforeEach(async () => {
      await client.investment.deleteMany({
        where: {
          client: {
            email: {
              contains: 'test-',
            },
          },
        },
      })

      payload = new Investment(mockInvestmentInput({
        clientId: createdClient.id,
      }))
    })
    it('should save investment successfully', async () => {
      await sut.save(payload)

      const response = await sut.list({
        id: createdClient.id,
      })

      expect(response.length).toBe(1)
      expect(response[0]).toBeInstanceOf(SavedInvestment)
    })
  })
})
