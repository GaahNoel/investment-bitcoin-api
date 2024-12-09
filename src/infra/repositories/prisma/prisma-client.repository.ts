import { CreateClientRepository } from '@/domain/contracts/create-client-repository.contract'
import { FindClientRepository, FindClientRepositoryInput } from '@/domain/contracts/find-client-repository.contract'
import { ClientInput, SavedClient } from '@/domain/entities/client'
import { client } from './config/connection'
import { PrismaClientMapper } from './mappers/client.mapper'
import { Logger } from '@/domain/contracts/logger.contract'
import { UpdateClientRepository } from '@/domain/contracts/update-client-repository.contract'

export class PrismaClientRepository implements CreateClientRepository, FindClientRepository, UpdateClientRepository {
  constructor(private readonly logger: Logger) {}

  async create(input: ClientInput): Promise<SavedClient> {
    const response = await client.client.create({
      data: PrismaClientMapper.toPrisma(input),
    })

    return PrismaClientMapper.toDomain(response)
  }

  async find(input: FindClientRepositoryInput): Promise<SavedClient | undefined> {
    const response = await client.client.findFirst({
      where: {
        OR: [{
          email: input.email,
        }, {
          id: input.id,
        }],
      },
    })

    if (!response) {
      return undefined
    }

    return PrismaClientMapper.toDomain(response)
  }

  async update(id: string, input: Partial<ClientInput>): Promise<SavedClient> {
    const response = await client.client.update({
      data: {
        balanceInCents: input.balance,
        email: input.email,
        name: input.name,
      },
      where: {
        id: id,
      },
    })

    return PrismaClientMapper.toDomain(response)
  }
}
