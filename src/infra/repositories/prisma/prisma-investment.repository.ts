import { client } from './config/connection'
import { Logger } from '@/domain/contracts/logger.contract'
import { PrismaInvestmentMapper } from './mappers/investment.mapper'
import { SaveInvestmentRepository, SaveInvestmentRepositoryInput } from '@/domain/contracts/save-investment-repository.contract'
import { SavedInvestment } from '@/domain/entities/investment'

export class PrismaInvestmentRepository implements SaveInvestmentRepository {
  constructor(private readonly logger: Logger) {}
  async save(input: SaveInvestmentRepositoryInput): Promise<SavedInvestment> {
    const response = await client.investment.create({
      data: PrismaInvestmentMapper.toPrisma(input),
    })

    return PrismaInvestmentMapper.toDomain(response)
  }
}
