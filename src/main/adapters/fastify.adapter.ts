/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseController } from '@/application/controllers/base.controller'
import { HttpMapper } from '@/application/mappers/http.mapper'
import { BaseMiddleware } from '@/application/middlewares/base.middleware'
import { UnauthorizedError } from '@/domain/errors/unauthorized.error'
import * as jose from 'jose'
import { FastifyReply, FastifyRequest } from 'fastify'

export class FastifyAdapter {
  static async adaptRoute(controller: BaseController<unknown>, request: FastifyRequest, reply: FastifyReply) {
    const response = await controller.handle({
      ...request.body as any,
      ...request.params as any,
      id: request.userId,
    })

    reply.status(response.statusCode).send(response.body)
  }

  static async adaptMiddleware(middleware: BaseMiddleware, request: FastifyRequest, reply: FastifyReply) {
    try {
      const response = await middleware.handle({
        ...request.body as any,
        ...request.params as any,
        ...request.headers as any,
        token: request.headers.authorization ? request.headers.authorization.split(' ')[1] : undefined,
      })

      if (typeof response.id === 'string') {
        request.userId = response.id
      }
    }
    catch (error) {
      if (error instanceof UnauthorizedError || error instanceof jose.errors.JWSSignatureVerificationFailed) {
        const mappedResponse = HttpMapper.unauthorized(error)
        reply.status(mappedResponse.statusCode).send(mappedResponse.body)
      }

      reply.status(500)
    }
  }
}
