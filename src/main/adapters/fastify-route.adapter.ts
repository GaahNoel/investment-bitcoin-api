/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseController } from '@/application/controllers/base.controller'
import { FastifyReply, FastifyRequest } from 'fastify'

export class FastifyAdapter {
  static async adapt(controller: BaseController<any>, request: FastifyRequest, reply: FastifyReply) {
    const response = await controller.handle({
      ...request.body as any,
      ...request.params as any,
    })

    reply.status(response.statusCode).send(response.body)
  }
}
