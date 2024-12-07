import { TokenCreatorInput } from '@/domain/contracts/create-token.contract'
import { Jose } from '@/infra/libs/jose.lib'
import { describe, expect, beforeEach, it } from 'vitest'

describe('Jose', () => {
  let sut: Jose
  let payload: TokenCreatorInput

  beforeEach(() => {
    payload = {
      data: {
        id: 'any-id',
      },
    }

    sut = new Jose()
  })

  it('should create a jwt token correctly and on decode, return the correct id', async () => {
    const token = await sut.create(payload)
    const response = await sut.decode(token)

    expect(token).toBeDefined()
    expect(response.id).toBe(payload.data.id)
  })
})
