import { CreateClientRepository } from '@/domain/contracts/create-client-repository.contract'
import { CreateClient } from '@/domain/contracts/create-client.contract'
import { Encrypter } from '@/domain/contracts/encrypter.contract'
import { FindClientRepository } from '@/domain/contracts/find-client-repository.contract'
import { Logger } from '@/domain/contracts/logger.contract'
import { ClientInput, SavedClient } from '@/domain/entities/client'
import { InvalidInputError } from '@/domain/errors/invalid-input.error'

export class CreateClientUseCase implements CreateClient {
  constructor(
    private readonly findClientRepository: FindClientRepository,
    private readonly createClientRepository: CreateClientRepository,
    private readonly encrypter: Encrypter,
    private readonly logger: Logger,
  ) {}

  async handle(input: ClientInput): Promise<SavedClient> {
    this.logger.info('Client creation process started')

    const foundClient = await this.findClientRepository.find({
      email: input.email,
    })

    if (foundClient) {
      throw new InvalidInputError('A client with same email has been found, cannot create other one with the same email')
    }

    const savedClient = await this.createClientRepository.create({
      email: input.email,
      name: input.name,
      password: this.encrypter.encrypt(input.password),
      balance: input.balance,
    })

    this.logger.info('Client creation process ended successfully')

    return savedClient
  }
}
