import { Deposit as DepositContract, DepositInput } from '../contracts/deposit.contract'
import { FindClientRepository } from '../contracts/find-client-repository.contract'
import { Logger } from '../contracts/logger.contract'
import { SendMailInput } from '../contracts/mail-sender.contract'
import { SaveDepositRepository } from '../contracts/save-deposit-repository.contract'
import { SendToQueue } from '../contracts/send-to-queue.contract'
import { UpdateClientRepository } from '../contracts/update-client-repository.contract'
import { Deposit } from '../entities/deposit'
import { InvalidInputError } from '../errors/invalid-input.error'
import { DateObject } from '../value-objects/date'

export class DepositUseCase implements DepositContract {
  constructor(
    private readonly findClientRepository: FindClientRepository,
    private readonly updateClientRepository: UpdateClientRepository,
    private readonly sendToQueue: SendToQueue,
    private readonly saveDepositRepository: SaveDepositRepository,
    private readonly logger: Logger,
  ) {}

  async handle(input: DepositInput): Promise<void> {
    this.logger.info('Updating client current balance to the new one', {
      id: input.id,
    })
    const clientToUpdate = await this.findClientRepository.find({
      id: input.id,
    })

    if (!clientToUpdate) {
      throw new InvalidInputError('Client not found')
    }

    clientToUpdate.addBalance(input.amount)

    this.logger.info('Registering deposit', {
      id: input.id,
    })

    const deposit = new Deposit({
      amount: clientToUpdate.balance,
      date: new DateObject(new Date()),
      clientId: clientToUpdate.id,
    })

    await this.saveDepositRepository.save(deposit)

    await this.updateClientRepository.update(clientToUpdate.id, {
      balance: clientToUpdate.balance,
    })

    const email: SendMailInput = {
      email: clientToUpdate.email,
      subject: 'A new deposit have been made! 💵',
      text: `The amount deposited was ${input.amount}`,
    }

    await this.sendToQueue.send({
      queue: 'email',
      data: email,
    })

    this.logger.info('Client balance updated successfully', {
      id: input.id,
    })
  }
}
