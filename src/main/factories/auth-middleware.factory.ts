import { AuthMiddleware } from '@/application/middlewares/auth.middleware'
import { Jose } from '@/infra/libs/jose.lib'

export class AuthMiddlewareFactory {
  static make(): AuthMiddleware {
    const jose = new Jose()

    return new AuthMiddleware(jose)
  }
}
