import { LoginController } from '@/application/controllers/login.controller'
import { LoginUseCase } from '@/domain/usecases/login.usecase'
import { Jose } from '@/infra/libs/jose.lib'
import { NodeCrypto } from '@/infra/libs/node-crypto.lib'
import { PrismaClientRepository } from '@/infra/repositories/prisma/prisma-client.repository'

export class LoginControllerFactory {
  static make(): LoginController {
    const logger = {
      info: () => {},
      error: () => {},
    }
    const clientRepository = new PrismaClientRepository(logger)
    const encrypter = new NodeCrypto()
    const tokenHandler = new Jose()

    const loginUseCase = new LoginUseCase(clientRepository, encrypter, tokenHandler, logger)

    return new LoginController(loginUseCase, logger)
  }
}
