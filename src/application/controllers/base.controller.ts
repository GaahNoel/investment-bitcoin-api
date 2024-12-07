import { Logger } from '@/domain/contracts/logger.contract'
import { HttpResponse } from '../contracts/http.contract'
import { HttpMapper } from '../mappers/http.mapper'
import { ValidateOutput } from '../contracts/validate.contract'
import { InvalidInputError } from '@/domain/errors/invalid-input.error'

export abstract class BaseController<T> {
  constructor(protected readonly logger: Logger) {}

  abstract execute(input: T): Promise<HttpResponse>

  abstract validate(input: T): ValidateOutput

  public async handle(input: T): Promise<HttpResponse> {
    try {
      const validateResponse = this.validate(input)
      if (!validateResponse.success) {
        return HttpMapper.badRequest(validateResponse.reason)
      }

      return await this.execute(input)
    }
    catch (error) {
      if (error instanceof Error) {
        this.logger.error('Request failed', {
          error: error.message,
        })
      }

      if (error instanceof InvalidInputError) {
        return HttpMapper.badRequest(error)
      }

      return HttpMapper.internalServerError()
    }
  }
}
