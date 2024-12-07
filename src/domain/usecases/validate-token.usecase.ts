import { TokenDecoder } from '../contracts/decode-token.contract'
import { ValidateToken, ValidateTokenInput } from '../contracts/validate-token.contract'

export class ValidateTokenUseCase implements ValidateToken {
  constructor(private readonly tokenDecoder: TokenDecoder) {}

  async handle(input: ValidateTokenInput): Promise<boolean> {
    const decodedToken = await this.tokenDecoder.decode(input.token)

    if (input.id) {
      return input.id === decodedToken.id
    }

    return true
  }
}
