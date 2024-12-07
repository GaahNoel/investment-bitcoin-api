import { LoginInput } from '@/domain/contracts/login.contract'
import { InvalidInputError } from '@/domain/errors/invalid-input.error'
import { LoginUseCase } from '@/domain/usecases/login.usecase'
import { mockFindClientRepository } from '@/tests/mocks/infra/client-repository.mock'
import { mockHashComparer } from '@/tests/mocks/infra/encrypter.mock'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { mockTokenCreator } from '@/tests/mocks/infra/token-creator.mock'
import { beforeEach, describe, expect, it } from 'vitest'

describe('LoginUseCase', () => {
  let sut: LoginUseCase
  const findClientRepository = mockFindClientRepository()
  const hashComparer = mockHashComparer()
  const tokenCreator = mockTokenCreator()
  const logger = mockLogger()
  let payload: LoginInput

  beforeEach(() => {
    payload = {
      email: 'any-email',
      password: 'any-password',
    }

    sut = new LoginUseCase(findClientRepository, hashComparer, tokenCreator, logger)
  })

  it('should call findClientRepository, tokenCreator and hashComparer with correct params', async () => {
    await sut.handle(payload)

    expect(findClientRepository.find).toHaveBeenCalledWith({
      email: payload.email,
    })
    expect(hashComparer.compare).toHaveBeenCalledWith(payload.password, 'any-password')
    expect(tokenCreator.create).toHaveBeenCalledWith({
      data: {
        id: 'any-id',
      },
    })
  })

  it('should throw error if customer not found with provided email', async () => {
    findClientRepository.find.mockResolvedValueOnce(undefined)

    const promise = sut.handle(payload)

    await expect(promise).rejects.toThrow(InvalidInputError)
  })

  it('should throw error if customer password is wrong', async () => {
    hashComparer.compare.mockReturnValueOnce(false)

    const promise = sut.handle(payload)

    await expect(promise).rejects.toThrow(InvalidInputError)
  })
})
