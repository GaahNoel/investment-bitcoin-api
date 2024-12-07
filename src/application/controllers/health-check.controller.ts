import { HttpResponse } from '../contracts/http.contract'
import { ValidateOutput } from '../contracts/validate.contract'
import { HttpMapper } from '../mappers/http.mapper'
import { BaseController } from './base.controller'

export class HealthCheckController extends BaseController<unknown> {
  async execute(): Promise<HttpResponse> {
    return HttpMapper.success({
      message: 'Live! ✅',
    })
  }

  validate(): ValidateOutput {
    return {
      success: true,
    }
  }
}
