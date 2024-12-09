import { NodeFetch } from '@/infra/http/node-fetch.http'
import { beforeAll, MockInstance, vi, describe, it, expect, beforeEach } from 'vitest'

describe('NodeFetch', () => {
  let sut: NodeFetch
  let fetchSpy: MockInstance

  beforeAll(() => {
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        any: 'response',
      }),
    } as Response)
  })

  beforeEach(() => {
    sut = new NodeFetch()
  })

  it('should call fetch with correct params with query', async () => {
    await sut.get({
      url: 'http://any-url',
      query: {
        any: 'value',
        other: 'value',
      },
    })

    expect(fetchSpy).toHaveBeenCalledWith('http://any-url/?any=value&other=value', {
      method: 'GET',
    })
  })

  it('should call fetch with correct params without query', async () => {
    await sut.get({
      url: 'http://any-url',
    })

    expect(fetchSpy).toHaveBeenCalledWith('http://any-url/', {
      method: 'GET',
    })
  })
})
