import { BaseController } from './base.controller'
import { HttpResponse } from '../contracts/http.contract'
import { ValidateOutput } from '../contracts/validate.contract'
import { z } from 'zod'
import { Logger } from '@/domain/contracts/logger.contract'
import { HttpMapper } from '../mappers/http.mapper'
import { BuyBitcoin, BuyBitcoinInput } from '@/domain/contracts/buy-bitcoin.contract'

export class BuyBitcoinController extends BaseController<BuyBitcoinInput> {
  constructor(private readonly buyBitCoinUseCase: BuyBitcoin, logger: Logger) {
    super(logger)
  }

  async execute(input: BuyBitcoinInput): Promise<HttpResponse> {
    this.logger.info('Buy bitcoin controller process started', {
      id: input.id,
    })

    const response = await this.buyBitCoinUseCase.handle(input)

    this.logger.info('Buy bitcoin controller process finished', {
      id: input.id,
    })

    return HttpMapper.success(response.getDTO())
  }

  validate(input: BuyBitcoinInput): ValidateOutput {
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
