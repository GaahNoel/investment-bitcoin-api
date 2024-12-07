/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string
  }
}
