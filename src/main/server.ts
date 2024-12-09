import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import 'dotenv/config'
import { env } from '@/main/config/env'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { healthCheck } from './routes/health-check'
import { clients } from './routes/clients'
import { MailSenderFactory } from './factories/mail-sender.factory'
import { bitcoin } from './routes/bitcoin'

const sendGridEmailSender = MailSenderFactory.make()

export const server = fastify()
server.register(fastifySwagger)
server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})
server.register(healthCheck)
server.register(clients)
server.register(bitcoin)

async function startServer() {
  await sendGridEmailSender.sendMail()

  await server.listen({
    port: env.SERVER_PORT,
    host: '0.0.0.0',
  })
  await server.ready()

  server.swagger()
  console.log(`Server Running on port ${env.SERVER_PORT} 🚀`)
}

void startServer()
