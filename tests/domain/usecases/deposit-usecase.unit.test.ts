import { DepositInput } from '@/domain/contracts/deposit.contract'
import { Deposit } from '@/domain/entities/deposit'
import { InvalidInputError } from '@/domain/errors/invalid-input.error'
import { DepositUseCase } from '@/domain/usecases/deposit.usecase'
import { DateObject } from '@/domain/value-objects/date'
import { mockFindClientRepository, mockUpdateClientRepository } from '@/tests/mocks/infra/client-repository.mock'
import { mockSaveDepositRepository } from '@/tests/mocks/infra/deposity-repository.mock'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { mockSendToQueue } from '@/tests/mocks/infra/send-to-queue.mock'
import { expect, beforeEach, describe, it, vi } from 'vitest'

vi.useFakeTimers({
  now: new Date('2024-01-01'),
})

describe('DepositUseCase', () => {
  let sut: DepositUseCase
  const logger = mockLogger()
  const findClientRepository = mockFindClientRepository()
  const updateClientRepository = mockUpdateClientRepository()
  const sendToEmailQueue = mockSendToQueue()
  const saveDepositRepository = mockSaveDepositRepository()
  let payload: DepositInput

  beforeEach(() => {
    payload = {
      id: 'any-id',
      amount: 100,
    }

    sut = new DepositUseCase(findClientRepository, updateClientRepository, sendToEmailQueue, saveDepositRepository, logger)
  })

  it('should call all the required repositories with correct params', async () => [
    await sut.handle(payload),

    expect(findClientRepository.find).toHaveBeenCalledWith({
      id: payload.id,
    }),

    expect(saveDepositRepository.save).toHaveBeenCalledWith(new Deposit({
      amount: 100,
      date: new DateObject(new Date()),
      clientId: 'any-id',
    })),

    expect(updateClientRepository.update).toHaveBeenCalledWith('any-id', {
      balance: 200,
    }),

    expect(sendToEmailQueue.send).toHaveBeenCalled(),
  ])

  it('should throw error if client provided was not found', async () => {
    findClientRepository.find.mockResolvedValueOnce(undefined)

    const promise = sut.handle(payload)

    await expect(promise).rejects.toThrow(InvalidInputError)
  })

  it('should throw error if amount provided is lower than zero', async () => {
    const promise = sut.handle({
      ...payload,
      amount: -1,
    })

    await expect(promise).rejects.toThrow(InvalidInputError)
  })
})
