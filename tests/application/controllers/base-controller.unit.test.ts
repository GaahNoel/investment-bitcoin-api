import { HttpResponse } from '@/application/contracts/http.contract'
import { ValidateOutput } from '@/application/contracts/validate.contract'
import { BaseController } from '@/application/controllers/base.controller'
import { HttpMapper } from '@/application/mappers/http.mapper'
import { InvalidInputError } from '@/domain/errors/invalid-input.error'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { expect, describe, it, beforeEach } from 'vitest'

type FakeControllerInput = {
  invalidInputError?: boolean
  internalServerError?: boolean
  validationError?: boolean
}

class FakeController extends BaseController<FakeControllerInput> {
  async execute(input: FakeControllerInput): Promise<HttpResponse> {
    if (input.internalServerError) {
      throw new Error()
    }

    if (input.invalidInputError) {
      throw new InvalidInputError('any')
    }

    return HttpMapper.success()
  }

  validate(input: FakeControllerInput): ValidateOutput {
    if (input.validationError) {
      return {
        success: false,
        reason: {
          any: 'message',
        },
      }
    }

    return {
      success: true,
    }
  }
}

describe('BaseController', () => {
  let sut: FakeController

  beforeEach(() => {
    sut = new FakeController(mockLogger())
  })

  it('should return bad request if received a validation error', async () => {
    const response = await sut.handle({
      validationError: true,
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return bad request if received a invalid input error', async () => {
    const response = await sut.handle({
      invalidInputError: true,
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return internal server error if receive an unhandled error', async () => {
    const response = await sut.handle({
      internalServerError: true,
    })

    expect(response.statusCode).toBe(500)
  })

  it('should return controller response if executed successfully', async () => {
    const executeResponse = await sut.execute({})
    const response = await sut.handle({})

    expect(response.statusCode).toBe(executeResponse.statusCode)
  })
})
