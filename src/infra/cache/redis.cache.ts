import { Logger } from '@/domain/contracts/logger.contract'
import { Cache, GetCacheInput, GetCacheOutput, SaveCacheInput } from '../contracts/cache.contract'
import { cacheClient } from './config'

export class RedisCache implements Cache {
  constructor(private readonly logger: Logger) {}
  async save(input: SaveCacheInput): Promise<void> {
    this.logger.info('Saving new value for provided key on cache', {
      key: input.key,
    })

    await cacheClient.set(
      input.key,
      JSON.stringify(input.value),
      'EX',
      input.expirationInSeconds,
    )
  }

  async get<T>(key: GetCacheInput): Promise<GetCacheOutput<T>> {
    this.logger.info('Searching for provided key on cache', {
      key,
    })
    const response = await cacheClient.get(key)
    if (!response) {
      this.logger.info('Key not found', {
        key,
      })
      return undefined
    }
    return JSON.parse(response)
  }
}
