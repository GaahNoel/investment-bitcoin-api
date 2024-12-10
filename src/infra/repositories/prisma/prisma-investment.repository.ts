import { client } from './config/connection'
import { Logger } from '@/domain/contracts/logger.contract'
import { PrismaInvestmentMapper } from './mappers/investment.mapper'
import { SaveInvestmentRepository, SaveInvestmentRepositoryInput } from '@/domain/contracts/save-investment-repository.contract'
import { SavedInvestment } from '@/domain/entities/investment'
import { ListInvestmentRepository, ListInvestmentRepositoryInput } from '@/domain/contracts/list-investment-repository.contract'

export class PrismaInvestmentRepository implements SaveInvestmentRepository, ListInvestmentRepository {
  constructor(private readonly logger: Logger) {}

  async save(input: SaveInvestmentRepositoryInput): Promise<SavedInvestment> {
    const response = await client.investment.create({
      data: PrismaInvestmentMapper.toPrisma(input),
    })

    return PrismaInvestmentMapper.toDomain(response)
  }

  async list(input: ListInvestmentRepositoryInput): Promise<SavedInvestment[]> {
    const response = await client.investment.findMany({
      where: {
        clientId: input.id,
      },
      orderBy: {
        orderDate: 'asc',
      },
    })

    return response.map(investment => PrismaInvestmentMapper.toDomain(investment))
  }
}
