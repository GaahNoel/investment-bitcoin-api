import { ClientInput } from '@/domain/entities/client'
import { BaseController } from './base.controller'
import { HttpResponse } from '../contracts/http.contract'
import { ValidateOutput } from '../contracts/validate.contract'
import { z } from 'zod'
import { CreateClient } from '@/domain/contracts/create-client.contract'
import { Logger } from '@/domain/contracts/logger.contract'
import { HttpMapper } from '../mappers/http.mapper'

export class RegisterController extends BaseController<ClientInput> {
  constructor(private readonly createClient: CreateClient, logger: Logger) {
    super(logger)
  }

  async execute(input: ClientInput): Promise<HttpResponse> {
    this.logger.info('Starting register of client', {
      name: input.name,
    })

    const createdClient = await this.createClient.handle(input)

    return HttpMapper.created(createdClient.getDTO())
  }

  validate(input: ClientInput): ValidateOutput {
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
      balance: z.number().gt(0),
    })

    const response = schema.safeParse(input)

    return {
      success: response.success,
      reason: response.error,
    }
  }
}
