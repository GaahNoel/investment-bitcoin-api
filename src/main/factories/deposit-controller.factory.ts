import { WinstonLogger } from '@/infra/libs/winston-logger.lib'
import { RabbitMQQueue } from '@/infra/queue/rabbit-mq.queue'
import { PrismaClientRepository } from '@/infra/repositories/prisma/prisma-client.repository'
import { env } from '../config/env'
import { DepositController } from '@/application/controllers/deposit.controller'
import { DepositUseCase } from '@/domain/usecases/deposit.usecase'
import { PrismaDepositRepository } from '@/infra/repositories/prisma/prisma-deposit.repository'

export class DepositControllerFactory {
  static make(): DepositController {
    const logger = new WinstonLogger()
    const clientRepository = new PrismaClientRepository(logger)
    const sendToQueue = new RabbitMQQueue(env.RABBITMQ_URL, logger)
    const depositRepository = new PrismaDepositRepository(logger)

    const createClientUseCase = new DepositUseCase(clientRepository, clientRepository, sendToQueue, depositRepository, logger)

    return new DepositController(createClientUseCase, logger)
  }
}
