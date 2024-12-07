import { Login, LoginInput } from '@/domain/contracts/login.contract'
import { BaseController } from './base.controller'
import { HttpResponse } from '../contracts/http.contract'
import { ValidateOutput } from '../contracts/validate.contract'
import { z } from 'zod'
import { Logger } from '@/domain/contracts/logger.contract'
import { HttpMapper } from '../mappers/http.mapper'

export class LoginController extends BaseController<LoginInput> {
  constructor(private readonly login: Login, logger: Logger) {
    super(logger)
  }

  async execute(input: LoginInput): Promise<HttpResponse> {
    this.logger.info('Starting login process')

    const response = await this.login.handle(input)

    this.logger.info('Login process finished')
    return HttpMapper.success(response)
  }

  validate(input: LoginInput): ValidateOutput {
    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { success, error } = schema.safeParse(input)

    return {
      success,
      reason: error,
    }
  }
}
