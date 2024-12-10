import { GetInvestmentPosition, GetInvestmentPositionInput } from '@/domain/contracts/get-investment-position.contract'
import { BaseController } from './base.controller'
import { HttpResponse } from '../contracts/http.contract'
import { ValidateOutput } from '../contracts/validate.contract'
import { z } from 'zod'
import { Logger } from '@/domain/contracts/logger.contract'
import { HttpMapper } from '../mappers/http.mapper'

export class GetInvestmentPositionController extends BaseController<GetInvestmentPositionInput> {
  constructor(private readonly getInvestmentPositionUseCase: GetInvestmentPosition, logger: Logger) {
    super(logger)
  }

  async execute(input: GetInvestmentPositionInput): Promise<HttpResponse> {
    this.logger.info('Get investment position controller process started', {
      id: input.id,
    })

    const response = await this.getInvestmentPositionUseCase.handle(input)

    this.logger.info('Get investment position process finished', {
      id: input.id,
    })

    return HttpMapper.success(response)
  }

  validate(input: GetInvestmentPositionInput): ValidateOutput {
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
