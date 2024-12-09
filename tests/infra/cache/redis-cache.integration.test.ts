import { RedisCache } from '@/infra/cache/redis.cache'
import { SaveCacheInput } from '@/infra/contracts/cache.contract'
import { mockLogger } from '@/tests/mocks/infra/logger.mock'
import { describe, expect, beforeEach, it } from 'vitest'

describe('RedisCache', () => {
  let sut: RedisCache
  let payload: SaveCacheInput

  beforeEach(() => {
    payload = {
      key: 'any',
      value: {
        any: 'value',
      },
      expirationInSeconds: 100,
    }

    sut = new RedisCache(mockLogger())
  })

  it('should save and retrieve a cache register correctly', async () => {
    await expect(sut.save(payload)).resolves.not.toThrow()

    const response = await sut.get(payload.key)
    expect(response).toEqual({
      any: 'value',
    })
  })

  it('should return undefined if key not found', async () => {
    const response = await sut.get('any-other')
    expect(response).toEqual(undefined)
  })
})
