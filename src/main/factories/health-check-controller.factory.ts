import { HealthCheckController } from '@/application/controllers/health-check.controller'
import { WinstonLogger } from '@/infra/libs/winston-logger.lib'

export class HealthCheckControllerFactory {
  static make(): HealthCheckController {
    const logger = new WinstonLogger()

    return new HealthCheckController(logger)
  }
}
