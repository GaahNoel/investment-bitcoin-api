export type BaseMiddlewareOutput = Record<string, unknown>

export interface BaseMiddleware {
  handle(input: unknown): Promise<BaseMiddlewareOutput>
}
