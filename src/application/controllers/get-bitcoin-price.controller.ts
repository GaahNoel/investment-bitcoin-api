import { GetBitcoinPriceUseCase } from '@/domain/usecases/get-bitcoin-price.usecase'
import { HttpResponse } from '../contracts/http.contract'
import { ValidateOutput } from '../contracts/validate.contract'
import { BaseController } from './base.controller'
import { Logger } from '@/domain/contracts/logger.contract'
import { HttpMapper } from '../mappers/http.mapper'

export class GetBitcoinPriceController extends BaseController<void> {
  constructor(
    private readonly getBitcoinPriceUseCase: GetBitcoinPriceUseCase,
    logger: Logger,
  ) {
    super(logger)
  }

  async execute(): Promise<HttpResponse> {
    this.logger.info('Starting get bitcoin price process')

    const response = await this.getBitcoinPriceUseCase.handle()

    this.logger.info('Finished get bitcoin price process')
    return HttpMapper.success(response)
  }

  validate(): ValidateOutput {
    return {
      success: true,
    }
  }
}
