import { SavedClient } from '@/domain/entities/client'
import { Deposit, SavedDeposit } from '@/domain/entities/deposit'
import { client } from '@/infra/repositories/prisma/config/connection'
import { PrismaClientRepository } from '@/infra/repositories/prisma/prisma-client.repository'
import { PrismaDepositRepository } from '@/infra/repositories/prisma/prisma-deposit.repository'
import { mockClientInput } from '@/tests/mocks/entities/client.mock'
import { mockDepositInput } from '@/tests/mocks/entities/deposit.mock'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'

import { describe, expect, beforeEach, it, beforeAll, afterAll } from 'vitest'

describe('PrismaDepositRepository', () => {
  let sut: PrismaDepositRepository
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
    sut = new PrismaDepositRepository(logger)
  })

  afterAll(async () => {
    await client.deposit.deleteMany({
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
    let payload: Deposit

    beforeEach(() => {
      payload = new Deposit(mockDepositInput({
        clientId: createdClient.id,
      }))
    })
    it('should save deposit successfully', async () => {
      const response = await sut.save(payload)

      expect(response).toBeInstanceOf(SavedDeposit)
      expect(response.id).toBeDefined()
    })
  })
})
