export type TokenDecoderInput = string

export type TokenDecoderOutput = {
  id: string
}

export interface TokenDecoder {
  decode(input: TokenDecoderInput): Promise<TokenDecoderOutput>
}
