import { TokenCreator } from '../contracts/create-token.contract'
import { HashComparer } from '../contracts/encrypter.contract'
import { FindClientRepository } from '../contracts/find-client-repository.contract'
import { Logger } from '../contracts/logger.contract'
import { Login, LoginInput, LoginOutput } from '../contracts/login.contract'
import { InvalidInputError } from '../errors/invalid-input.error'

export class LoginUseCase implements Login {
  constructor(
    private readonly findClientRepository: FindClientRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenCreator: TokenCreator,
    private readonly logger: Logger,
  ) {}

  async handle(input: LoginInput): Promise<LoginOutput> {
    this.logger.info('Searching for client')
    const foundClient = await this.findClientRepository.find({
      email: input.email,
    })

    if (!foundClient) {
      const message = 'Client not found with provided email'
      this.logger.error(message)
      throw new InvalidInputError('email', message)
    }
    this.logger.info('Validating password')
    const isValidPassword = this.hashComparer.compare(foundClient.password, input.password)

    if (!isValidPassword) {
      this.logger.error('Invalid password provided')
      throw new InvalidInputError('password', 'Provided credentials are invalid')
    }
    this.logger.info('Creating access token')
    const token = await this.tokenCreator.create({
      data: {
        id: foundClient.id,
      },
    })

    return {
      token,
    }
  }
}
