import { RegisterController } from '@/application/controllers/register.controller'
import { CreateClientUseCase } from '@/domain/usecases/create-client.usecase'
import { NodeCrypto } from '@/infra/libs/node-crypto.lib'
import { WinstonLogger } from '@/infra/libs/winston-logger.lib'
import { RabbitMQQueue } from '@/infra/queue/rabbit-mq.queue'
import { PrismaClientRepository } from '@/infra/repositories/prisma/prisma-client.repository'
import { env } from '../config/env'

export class RegisterControllerFactory {
  static make(): RegisterController {
    const logger = new WinstonLogger()
    const clientRepository = new PrismaClientRepository(logger)
    const encrypter = new NodeCrypto()
    const sendToQueue = new RabbitMQQueue(env.RABBITMQ_URL, logger)

    const createClientUseCase = new CreateClientUseCase(clientRepository, clientRepository, encrypter, sendToQueue, logger)

    return new RegisterController(createClientUseCase, logger)
  }
}
