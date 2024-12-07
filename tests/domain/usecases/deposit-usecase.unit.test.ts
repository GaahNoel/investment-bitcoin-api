import { DepositInput } from '@/domain/contracts/deposit.contract'
import { InvalidInputError } from '@/domain/errors/invalid-input.error'
import { DepositUseCase } from '@/domain/usecases/deposit.usecase'
import { mockFindClientRepository, mockUpdateClientRepository } from '@/tests/mocks/infra/client-repository.mock'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { mockSendToQueue } from '@/tests/mocks/infra/send-to-queue.mock'
import { expect, beforeEach, describe, it } from 'vitest'

describe('DepositUseCase', () => {
  let sut: DepositUseCase
  const logger = mockLogger()
  const findClientRepository = mockFindClientRepository()
  const updateClientRepository = mockUpdateClientRepository()
  const sendToEmailQueue = mockSendToQueue()
  let payload: DepositInput

  beforeEach(() => {
    payload = {
      id: 'any-id',
      amount: 100,
    }

    sut = new DepositUseCase(findClientRepository, updateClientRepository, sendToEmailQueue, logger)
  })

  it('should call find and update client repository with correct params', async () => [
    await sut.handle(payload),

    expect(findClientRepository.find).toHaveBeenCalledWith({
      id: payload.id,
    }),

    expect(updateClientRepository.update).toHaveBeenCalledWith('any-id', {
      balance: 200,
    }),

    expect(sendToEmailQueue.send).toHaveBeenCalled(),
  ])

  it('should throw error if amount provided is lower than zero', async () => {
    const promise = sut.handle({
      ...payload,
      amount: -1,
    })

    await expect(promise).rejects.toThrow(InvalidInputError)
  })
})
