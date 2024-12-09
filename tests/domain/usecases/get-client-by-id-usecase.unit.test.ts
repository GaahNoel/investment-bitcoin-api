import { SavedClient } from '@/domain/entities/client'
import { GetClientByIdUseCase } from '@/domain/usecases/get-client-by-id.usecase'
import { mockFindClientRepository } from '@/tests/mocks/infra/client-repository.mock'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { expect, beforeEach, describe, it } from 'vitest'

describe('GetClientByIdUseCase', () => {
  let sut: GetClientByIdUseCase
  const findClientRepository = mockFindClientRepository()
  const logger = mockLogger()

  beforeEach(() => {
    sut = new GetClientByIdUseCase(findClientRepository, logger)
  })

  it('should call findClientRepository with correct params and return the response if found', async () => {
    const response = await sut.handle('any-id')

    expect(response).toBeInstanceOf(SavedClient)
    expect(response?.id).toBe('any-id')
  })

  it('should return undefined if not found client', async () => {
    findClientRepository.find.mockResolvedValueOnce(undefined)

    const response = await sut.handle('any-id')

    expect(response).toBe(undefined)
  })

  it('should throw error if findClientRepository throws', async () => {
    findClientRepository.find.mockRejectedValueOnce(new Error())

    const response = sut.handle('any-id')

    await expect(response).rejects.toThrow()
  })
})
