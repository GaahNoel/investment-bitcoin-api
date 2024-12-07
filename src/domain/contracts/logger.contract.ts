export interface Logger {
  info: (message: string, props?: Record<string, unknown>) => void
  error: (message: string, props?: Record<string, unknown>) => void
}
