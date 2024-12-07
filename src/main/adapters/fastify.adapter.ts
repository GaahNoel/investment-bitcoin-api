/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseController } from '@/application/controllers/base.controller'
import { FastifyReply, FastifyRequest } from 'fastify'

export class FastifyAdapter {
  static async adaptRoute(controller: BaseController<unknown>, request: FastifyRequest, reply: FastifyReply) {
    const response = await controller.handle({
      ...request.body as any,
      ...request.params as any,
    })

    reply.status(response.statusCode).send(response.body)
  }

  static async adaptMiddleware(middleware: BaseController<unknown>, request: FastifyRequest) {
    await middleware.handle(request)
  }
}
