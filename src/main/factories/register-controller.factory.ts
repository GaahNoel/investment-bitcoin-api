import { RegisterController } from '@/application/controllers/register.controller'
import { CreateClientUseCase } from '@/domain/usecases/create-client.usecase'
import { NodeCrypto } from '@/infra/libs/node-crypto.lib'
import { PrismaClientRepository } from '@/infra/repositories/prisma/prisma-client.repository'

export class RegisterControllerFactory {
  static make(): RegisterController {
    const logger = {
      info: () => {},
      error: () => {},
    }
    const clientRepository = new PrismaClientRepository(logger)
    const encrypter = new NodeCrypto()

    const createClientUseCase = new CreateClientUseCase(clientRepository, clientRepository, encrypter, logger)

    return new RegisterController(createClientUseCase, logger)
  }
}
