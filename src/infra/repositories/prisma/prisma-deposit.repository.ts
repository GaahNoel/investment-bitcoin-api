import { SaveDepositRepository, SaveDepositRepositoryInput } from '@/domain/contracts/save-deposit-repository.contract'
import { SavedDeposit } from '@/domain/entities/deposit'
import { client } from './config/connection'
import { PrismaDepositMapper } from './mappers/deposit.mapper'
import { Logger } from '@/domain/contracts/logger.contract'

export class PrismaDepositRepository implements SaveDepositRepository {
  constructor(private readonly logger: Logger) {}
  async save(input: SaveDepositRepositoryInput): Promise<SavedDeposit> {
    const response = await client.deposit.create({
      data: PrismaDepositMapper.toPrisma(input),
    })

    return PrismaDepositMapper.toDomain(response)
  }
}
