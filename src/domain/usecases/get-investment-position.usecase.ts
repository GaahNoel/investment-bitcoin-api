import { GetBitcoinPriceRepository } from '../contracts/get-bitcoin-price-repository'
import { GetInvestmentPosition, GetInvestmentPositionInput, GetInvestmentPositionOutput } from '../contracts/get-investment-position.contract'
import { ListInvestmentRepository } from '../contracts/list-investment-repository.contract'
import { Logger } from '../contracts/logger.contract'
import { InvalidInputError } from '../errors/invalid-input.error'

export class GetInvestmentPositionUseCase implements GetInvestmentPosition {
  constructor(
    private readonly listInvestmentRepository: ListInvestmentRepository,
    private readonly getBitcoinPriceRepository: GetBitcoinPriceRepository,
    private readonly logger: Logger,
  ) {}

  async handle(input: GetInvestmentPositionInput): Promise<GetInvestmentPositionOutput[]> {
    this.logger.info('Searching for investments', {
      id: input.id,
    })
    const investments = await this.listInvestmentRepository.list({
      id: input.id,
    })

    if (investments.length === 0) {
      this.logger.info('Investments not found', {
        id: input.id,
      })
      throw new InvalidInputError('id', 'No investments found')
    }

    const { sell } = await this.getBitcoinPriceRepository.get()

    this.logger.info('Mapping investment information', {
      id: input.id,
    })

    const mappedInvestments = investments.map((investment) => {
      const mappedInvestment: GetInvestmentPositionOutput = {
        amount: investment.amount,
        bitcoinPrice: investment.bitcoinPrice,
        bitcoinVariationPercent: ((sell / investment.bitcoinPrice) - 1) * 100,
        grossCurrentInvestmentValue: Math.round(sell * investment.amount),
        investmentValue: investment.investmentValue,
        orderDate: investment.date.toShortString(),
      }

      return mappedInvestment
    })

    this.logger.info('Investment position created', {
      id: input.id,
    })

    return mappedInvestments
  }
}
