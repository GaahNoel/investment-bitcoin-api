import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import { fastifyAutoload } from '@fastify/autoload'
import path from 'path'
import 'dotenv/config'
import { env } from '@/main/config/env'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { healthcheck } from './routes/healthcheck'

async function startServer() {
  const server = fastify()
  await server.register(fastifySwagger)
  server.register(fastifyAutoload, {
    dir: path.join(__dirname, 'routes'),
  })

  server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })

  server.register(healthcheck)

  await server.listen({
    port: env.SERVER_PORT,
    host: 'localhost',
  })
  await server.ready()

  server.swagger()
  console.log(`Server Running on port ${env.SERVER_PORT} 🚀`)
}

void startServer()
