import { BuyBitcoin, BuyBitcoinInput } from '../contracts/buy-bitcoin.contract'
import { FindClientRepository } from '../contracts/find-client-repository.contract'
import { GetBitcoinPriceRepository } from '../contracts/get-bitcoin-price-repository'
import { Logger } from '../contracts/logger.contract'
import { SendMailInput } from '../contracts/mail-sender.contract'
import { SaveInvestmentRepository } from '../contracts/save-investment-repository.contract'
import { SendToQueue } from '../contracts/send-to-queue.contract'
import { UpdateClientRepository } from '../contracts/update-client-repository.contract'
import { Investment, SavedInvestment } from '../entities/investment'
import { InvalidInputError } from '../errors/invalid-input.error'
import { DateObject } from '../value-objects/date'

export class BuyBitcoinUseCase implements BuyBitcoin {
  constructor(
    private readonly findClientRepository: FindClientRepository,
    private readonly getBitcoinPriceRepository: GetBitcoinPriceRepository,
    private readonly saveInvestmentRepository: SaveInvestmentRepository,
    private readonly updateClientRepository: UpdateClientRepository,
    private readonly sendToQueue: SendToQueue,
    private readonly logger: Logger,
  ) {}

  async handle(input: BuyBitcoinInput): Promise<SavedInvestment> {
    this.logger.info('Buying bitcoin', {
      id: input.id,
    })
    if (input.amount <= 0) {
      throw new InvalidInputError('amount', 'Cannot buy an amount lower than or equal zero')
    }

    const client = await this.findClientRepository.find({
      id: input.id,
    })

    if (!client) {
      this.logger.info('Client not found with provided id', {
        id: input.id,
      })
      throw new InvalidInputError('id', 'Client not found')
    }

    const bitcoin = await this.getBitcoinPriceRepository.get()

    const totalPrice = input.amount * bitcoin.buy

    if (client.balance < totalPrice) {
      this.logger.info('Total price ir higher than available balance', {
        id: input.id,
      })

      throw new InvalidInputError('amount', 'Cannot buy an amount of bitcoin greater than client balance')
    }

    client.subtractBalance(totalPrice)

    const investment = new Investment({
      amount: input.amount,
      bitcoinPrice: bitcoin.buy,
      clientId: input.id,
      date: new DateObject(new Date()),
      investmentValue: totalPrice,
    })

    const savedInvestment = await this.saveInvestmentRepository.save(investment)

    await this.updateClientRepository.update(client.id, {
      balance: client.balance,
    })

    this.logger.info('Buy process finished successfully, a new investment was registered for the user', {
      id: input.id,
      investmentId: savedInvestment.id,
    })

    const email: SendMailInput = {
      email: client.email,
      subject: 'A new investment have been made! 💵',
      text: `The investment value was ${totalPrice} used to buy ${input.amount} of BTC`,
    }

    await this.sendToQueue.send({
      queue: 'email',
      data: email,
    })

    return savedInvestment
  }
}
