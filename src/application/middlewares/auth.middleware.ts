import { TokenDecoder } from '@/domain/contracts/decode-token.contract'
import { UnauthorizedError } from '@/domain/errors/unauthorized.error'
import { BaseMiddlewareOutput } from './base.middleware'

export type AuthMiddlewareInput = {
  token: string
}

export class AuthMiddleware {
  constructor(private readonly tokenDecoder: TokenDecoder) {}

  async handle(input: AuthMiddlewareInput): Promise<BaseMiddlewareOutput> {
    if (!input.token) {
      throw new UnauthorizedError()
    }

    const decodedToken = await this.tokenDecoder.decode(input.token)

    return {
      id: decodedToken.id,
    }
  }
}
