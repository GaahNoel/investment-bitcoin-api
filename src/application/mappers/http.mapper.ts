import { HttpResponse } from '../contracts/http.contract'

export class HttpMapper {
  static success(body?: unknown): HttpResponse {
    return {
      statusCode: 200,
      body,
    }
  }

  static created(body?: unknown): HttpResponse {
    return {
      statusCode: 201,
      body,
    }
  }

  static badRequest(body?: unknown): HttpResponse {
    return {
      statusCode: 400,
      body,
    }
  }

  static internalServerError(body?: unknown): HttpResponse {
    return {
      statusCode: 500,
      body,
    }
  }
}
