export type HttpGetClientInput = {
  url: string
  query?: Record<string, string>
}

export interface HttpGetClient {
  get<T>(input: HttpGetClientInput): Promise<T>
}
