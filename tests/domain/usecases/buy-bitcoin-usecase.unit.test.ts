import { BuyBitcoinInput } from '@/domain/contracts/buy-bitcoin.contract'
import { SavedClient } from '@/domain/entities/client'
import { Investment, SavedInvestment } from '@/domain/entities/investment'
import { InvalidInputError } from '@/domain/errors/invalid-input.error'
import { BuyBitcoinUseCase } from '@/domain/usecases/buy-bitcoin.usecase'
import { mockSavedClientInput } from '@/tests/mocks/entities/client.mock'
import { mockInvestmentInput } from '@/tests/mocks/entities/investment'
import { mockGetBitcoinPrice } from '@/tests/mocks/infra/bitcoin-repository.mock'
import { mockFindClientRepository, mockUpdateClientRepository } from '@/tests/mocks/infra/client-repository.mock'
import { mockSaveInvestmentRepository } from '@/tests/mocks/infra/investment-repository.mock'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { mockSendToQueue } from '@/tests/mocks/infra/send-to-queue.mock'
import { beforeAll, expect, vi, beforeEach, describe, it } from 'vitest'

vi.useFakeTimers({
  now: new Date('2024-01-01'),
})

describe('BuyBitcoinUseCase', () => {
  let sut: BuyBitcoinUseCase
  const logger = mockLogger()
  const findClientRepository = mockFindClientRepository()
  const updateClientRepository = mockUpdateClientRepository()
  const getBitcoinPrice = mockGetBitcoinPrice()
  const investmentRepository = mockSaveInvestmentRepository()
  const sendToQueue = mockSendToQueue()
  let payload: BuyBitcoinInput

  beforeAll(() => {
    findClientRepository.find.mockResolvedValue(new SavedClient(mockSavedClientInput({
      balance: 10000,
    })))
  })

  beforeEach(() => {
    vi.clearAllMocks()

    payload = {
      amount: 100,
      id: 'any-id',
    }

    sut = new BuyBitcoinUseCase(findClientRepository, getBitcoinPrice, investmentRepository, updateClientRepository, sendToQueue, logger)
  })

  it('should call all dependencies correctly', async () => {
    await sut.handle(payload)

    expect(findClientRepository.find).toHaveBeenCalledWith({
      id: payload.id,
    })

    expect(getBitcoinPrice.get).toHaveBeenCalledTimes(1)

    expect(investmentRepository.save).toHaveBeenCalledWith(new Investment(mockInvestmentInput({
      bitcoinPrice: 100,
      investmentValue: 10000,
    })))

    expect(updateClientRepository.update).toHaveBeenCalledWith(payload.id, {
      balance: 0,
    })

    expect(sendToQueue.send).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'test-any@mail.com',
      }),
      queue: 'email',
    })
  })

  it('should return saved investment correctly', async () => {
    findClientRepository.find.mockResolvedValue(new SavedClient(mockSavedClientInput({
      balance: 10000,
    })))

    const response = await sut.handle(payload)

    expect(response).toBeInstanceOf(SavedInvestment)
    expect(response.id).toBeDefined()
  })

  it('should not allow to buy for a non existent client id ', async () => {
    findClientRepository.find.mockResolvedValueOnce(undefined)

    const promise = sut.handle(payload)

    await expect(promise).rejects.toThrow(InvalidInputError)
  })

  it('should not allow to buy a value higher than client balance ', async () => {
    payload.amount = 1000
    const promise = sut.handle(payload)

    await expect(promise).rejects.toThrow(InvalidInputError)
  })

  it('should not allow to buy a invalid bit coin amount', async () => {
    const promise = sut.handle({
      ...payload,
      amount: -1000,
    })

    await expect(promise).rejects.toThrow(InvalidInputError)
  })
})
