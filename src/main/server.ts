import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import { fastifyAutoload } from '@fastify/autoload'
import path from 'path'
import 'dotenv/config'
import { env } from '@/main/config/env'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { healthCheck } from './routes/health-check'
import { clients } from './routes/clients'
import { MailSenderFactory } from './factories/mail-sender.factory'

const sendGridEmailSender = MailSenderFactory.make()

async function startServer() {
  const server = fastify()
  await server.register(fastifySwagger)
  await sendGridEmailSender.sendMail()

  server.register(fastifyAutoload, {
    dir: path.join(__dirname, 'routes'),
  })

  server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })

  server.register(healthCheck)

  server.register(clients)

  await server.listen({
    port: env.SERVER_PORT,
    host: '0.0.0.0',
  })
  await server.ready()

  server.swagger()
  console.log(`Server Running on port ${env.SERVER_PORT} 🚀`)
}

void startServer()
