export type TokenCreatorInput = {
  data: Record<string, unknown>
}

export interface TokenCreator {
  create(input: TokenCreatorInput): Promise<string>
}
