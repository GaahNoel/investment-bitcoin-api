export type ValidateTokenInput = {
  token: string
  id?: string
}

export interface ValidateToken {
  handle(input: ValidateTokenInput): Promise<boolean>
}
