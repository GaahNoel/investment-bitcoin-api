import { ClientInput, SavedClient } from '@/domain/entities/client'
import { InvalidInputError } from '@/domain/errors/invalid-input.error'
import { mockClientInput, mockSavedClientInput } from '@/tests/mocks/entities/client.mock'
import { mockCreatedClientRepository, mockFindClientRepository } from '@/tests/mocks/infra/client-repository.mock'
import { mockEncrypter } from '@/tests/mocks/infra/encrypter.mock'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { CreateClientUseCase } from '@/domain/usecases/create-client.usecase'
import { beforeAll, beforeEach, describe, expect, vi, it } from 'vitest'

describe('CreateClientUseCase', () => {
  let sut: CreateClientUseCase
  let payload: ClientInput

  const findClientRepository = mockFindClientRepository()
  const createClientRepository = mockCreatedClientRepository()
  const encrypter = mockEncrypter()
  const logger = mockLogger()

  beforeAll(() => {
    findClientRepository.find.mockResolvedValue(undefined)
  })

  beforeEach(() => {
    vi.clearAllMocks()

    payload = mockClientInput()

    sut = new CreateClientUseCase(findClientRepository, createClientRepository, encrypter, logger)
  })

  it('should call find client repository with correct params', async () => {
    await sut.handle(payload)

    expect(findClientRepository.find).toHaveBeenCalledWith({
      email: payload.email,
    })
  })

  it('should call create client repository with correct params', async () => {
    await sut.handle(payload)

    expect(createClientRepository.create).toHaveBeenCalledWith({
      ...payload,
      password: 'encrypted-value',
    })
  })

  it('should throw error if an client with same email was found', async () => {
    findClientRepository.find.mockResolvedValueOnce(new SavedClient(mockSavedClientInput()))

    const promise = sut.handle(payload)

    expect(promise).rejects.toThrow(InvalidInputError)
  })

  it('should return saved client correctly', async () => {
    const response = await sut.handle(payload)

    expect(response).toBeInstanceOf(SavedClient)
  })
})
