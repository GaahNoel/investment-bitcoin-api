import { DepositInput } from '@/domain/contracts/deposit.contract'
import { BaseController } from './base.controller'
import { HttpResponse } from '../contracts/http.contract'
import { ValidateOutput } from '../contracts/validate.contract'
import { z } from 'zod'
import { DepositUseCase } from '@/domain/usecases/deposit.usecase'
import { Logger } from '@/domain/contracts/logger.contract'
import { HttpMapper } from '../mappers/http.mapper'

export class DepositController extends BaseController<DepositInput> {
  constructor(private readonly depositUseCase: DepositUseCase, logger: Logger) {
    super(logger)
  }

  async execute(input: DepositInput): Promise<HttpResponse> {
    this.logger.info('Deposit controller process started', {
      id: input.id,
    })

    await this.depositUseCase.handle(input)

    this.logger.info('Deposit controller process started', {
      id: input.id,
    })

    return HttpMapper.success()
  }

  validate(input: DepositInput): ValidateOutput {
    const schema = z.object({
      id: z.string(),
      amount: z.coerce.number(),
    })

    const { success, error } = schema.safeParse(input)
    return {
      success,
      reason: error,
    }
  }
}
