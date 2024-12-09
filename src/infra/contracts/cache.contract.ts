export type SaveCacheInput = {
  key: string
  value: Record<string, unknown>
  expirationInSeconds: number
}

export type GetCacheInput = string

export type GetCacheOutput<T> = T | undefined

export interface Cache {
  save(input: SaveCacheInput): Promise<void>
  get<T>(input: GetCacheInput): Promise<GetCacheOutput<T>>
}
