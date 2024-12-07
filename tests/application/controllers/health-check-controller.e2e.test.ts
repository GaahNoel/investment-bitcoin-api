import { healthCheck } from '@/main/routes/health-check'
import fastify from 'fastify'
import { expect, describe, it } from 'vitest'

describe('HealthCheckController E2E', () => {
  const server = fastify()
  server.register(healthCheck)

  it('should return a message showing that application is on', async () => {
    const response = await server.inject({
      url: '/health-check',
      method: 'GET',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().message).toBeDefined()
  })
})
