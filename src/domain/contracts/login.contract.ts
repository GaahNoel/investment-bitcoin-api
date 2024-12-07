export type LoginInput = {
  email: string
  password: string
}

export type LoginOutput = {
  token: string
}

export interface Login {
  handle(input: LoginInput): Promise<LoginOutput>
}
