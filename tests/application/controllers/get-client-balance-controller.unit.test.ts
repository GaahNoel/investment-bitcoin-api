import { GetClientBalanceController } from '@/application/controllers/get-client-balance.controller'
import { GetClientById } from '@/domain/contracts/get-client-by-id-usecase.contract'
import { SavedClient } from '@/domain/entities/client'
import { mockSavedClientInput } from '@/tests/mocks/entities/client.mock'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { describe, beforeEach, beforeAll, it, Mocked, expect, vi } from 'vitest'

describe('GetClientBalanceController Unit', () => {
  let sut: GetClientBalanceController
  let getClientByIdUseCase: Mocked<GetClientById>
  const logger = mockLogger()

  beforeAll(() => {
    getClientByIdUseCase = {
      handle: vi.fn().mockResolvedValue(new SavedClient(mockSavedClientInput())),
    }
  })

  beforeEach(() => {
    sut = new GetClientBalanceController(getClientByIdUseCase, logger)
  })

  it('should return bad request if client not found', async () => {
    const response = await sut.handle({
      id: 'any-id',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      balance: 100,
    })
  })

  it('should return bad request if client not found', async () => {
    getClientByIdUseCase.handle.mockResolvedValueOnce(undefined)

    const response = await sut.handle({
      id: 'any-id',
    })

    expect(response.statusCode).toBe(400)
  })
})
