import { FindClientRepository } from '../contracts/find-client-repository.contract'
import { GetClientById } from '../contracts/get-client-by-id-usecase.contract'
import { Logger } from '../contracts/logger.contract'
import { SavedClient } from '../entities/client'

export class GetClientByIdUseCase implements GetClientById {
  constructor(private readonly findClientRepository: FindClientRepository, private readonly logger: Logger) {}
  async handle(id: string): Promise<SavedClient | undefined> {
    this.logger.info('Searching for client', {
      id,
    })
    const response = await this.findClientRepository.find({
      id,
    })
    if (!response) {
      this.logger.info('Client not found', {
        id,
      })
      return undefined
    }

    this.logger.info('Client found', {
      id,
    })
    return response
  }
}
