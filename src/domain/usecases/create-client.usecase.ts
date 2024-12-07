import { CreateClientRepository } from '@/domain/contracts/create-client-repository.contract'
import { CreateClient } from '@/domain/contracts/create-client.contract'
import { Encrypter } from '@/domain/contracts/encrypter.contract'
import { FindClientRepository } from '@/domain/contracts/find-client-repository.contract'
import { Logger } from '@/domain/contracts/logger.contract'
import { ClientInput, SavedClient } from '@/domain/entities/client'
import { InvalidInputError } from '@/domain/errors/invalid-input.error'
import { SendToQueue } from '../contracts/send-to-queue.contract'

export class CreateClientUseCase implements CreateClient {
  constructor(
    private readonly findClientRepository: FindClientRepository,
    private readonly createClientRepository: CreateClientRepository,
    private readonly encrypter: Encrypter,
    private readonly sendToEmailQueue: SendToQueue,
    private readonly logger: Logger,
  ) {}

  async handle(input: ClientInput): Promise<SavedClient> {
    this.logger.info('Client creation process started')

    const foundClient = await this.findClientRepository.find({
      email: input.email,
    })

    if (foundClient) {
      throw new InvalidInputError('email', 'A client with same email has been found, cannot create other one with the same email')
    }

    const savedClient = await this.createClientRepository.create({
      email: input.email,
      name: input.name,
      password: this.encrypter.encrypt(input.password),
      balance: input.balance,
    })

    await this.sendToEmailQueue.send({
      queue: 'email',
      data: {
        email: input.email,
        subject: 'Client registered successfully!',
        text: 'Your register have been successfully created, got to login and enjoy the platform! 😊',
      },
    })

    this.logger.info('Client creation process ended successfully')

    return savedClient
  }
}
