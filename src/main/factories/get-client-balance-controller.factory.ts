import { GetClientBalanceController } from '@/application/controllers/get-client-balance.controller'
import { GetClientByIdUseCase } from '@/domain/usecases/get-client-by-id.usecase'
import { WinstonLogger } from '@/infra/libs/winston-logger.lib'
import { PrismaClientRepository } from '@/infra/repositories/prisma/prisma-client.repository'

export class GetClientBalanceControllerFactory {
  static make() {
    const logger = new WinstonLogger()
    const findClientRepository = new PrismaClientRepository(logger)

    const getClientByIdUseCase = new GetClientByIdUseCase(findClientRepository, logger)

    return new GetClientBalanceController(getClientByIdUseCase, logger)
  }
}
