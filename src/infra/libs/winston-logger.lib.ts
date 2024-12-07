import { Logger } from '@/domain/contracts/logger.contract'
import * as winston from 'winston'

export class WinstonLogger implements Logger {
  private readonly logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger({
      transports: [new winston.transports.Console({
        format: winston.format.simple(),
      })],
    })
  }

  info(message: string, props?: Record<string, unknown>) {
    this.logger.info(message, props)
  }

  error(message: string, props?: Record<string, unknown>) {
    this.logger.error(message, props)
  }
}
