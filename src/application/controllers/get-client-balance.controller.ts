import { GetClientById } from '@/domain/contracts/get-client-by-id-usecase.contract'
import { BaseController } from './base.controller'
import { Logger } from '@/domain/contracts/logger.contract'
import { HttpResponse } from '../contracts/http.contract'
import { ValidateOutput } from '../contracts/validate.contract'
import { z } from 'zod'
import { HttpMapper } from '../mappers/http.mapper'

type GetClientBalanceControllerInput = {
  id: string
}

export class GetClientBalanceController extends BaseController<GetClientBalanceControllerInput> {
  constructor(private readonly getClientByIdUseCase: GetClientById, logger: Logger) {
    super(logger)
  }

  async execute(input: GetClientBalanceControllerInput): Promise<HttpResponse> {
    this.logger.info('Starting get client balance process started')

    const response = await this.getClientByIdUseCase.handle(input.id)

    if (response) {
      this.logger.info('Get client balance process finished - client found')
      return HttpMapper.success({
        balance: response.balance,
      })
    }

    this.logger.info('Get client balance process finished - client not found')
    return HttpMapper.badRequest()
  }

  validate(input: GetClientBalanceControllerInput): ValidateOutput {
    const schema = z.object({
      id: z.string(),
    })

    const { success, error } = schema.safeParse(input)

    return {
      success,
      reason: error,
    }
  }
}
