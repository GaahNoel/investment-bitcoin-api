import { Environment } from '@/domain/const/environment'
import { env } from '@/main/config/env'
import { server } from '@/main/server'
import { expect, describe, it, beforeAll } from 'vitest'

describe('HealthCheckController E2E', () => {
  beforeAll(() => {
    env.ENV = Environment.Test

    env.SERVER_PORT = 3334
  })
  it('should return a message showing that application is on', async () => {
    const response = await server.inject({
      url: '/health-check',
      method: 'GET',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().message).toBeDefined()
  })
})
