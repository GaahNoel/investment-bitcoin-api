import { TokenCreator, TokenCreatorInput } from '@/domain/contracts/create-token.contract'
import { TokenDecoder, TokenDecoderInput, TokenDecoderOutput } from '@/domain/contracts/decode-token.contract'
import { env } from '@/main/config/env'
import { jwtVerify, SignJWT } from 'jose'

export class Jose implements TokenCreator, TokenDecoder {
  private readonly encodedSecret: Uint8Array

  constructor() {
    const encoder = new TextEncoder()
    this.encodedSecret = encoder.encode(env.JWT_SECRET)
  }

  async create(input: TokenCreatorInput): Promise<string> {
    return await new SignJWT({ ...input.data })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(this.encodedSecret)
  }

  async decode(input: TokenDecoderInput): Promise<TokenDecoderOutput> {
    const { payload } = await jwtVerify<{ id: string }>(input, this.encodedSecret)
    return {
      id: payload.id,
    }
  }
}
