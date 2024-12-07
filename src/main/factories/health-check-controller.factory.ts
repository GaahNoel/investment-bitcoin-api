import { HealthCheckController } from '@/application/controllers/health-check.controller'

export class HealthCheckControllerFactory {
  static make(): HealthCheckController {
    const logger = {
      info: () => {},
      error: () => {},
    }

    return new HealthCheckController(logger)
  }
}
