import { ClientInput, SavedClient } from '@/domain/entities/client'
import { Prisma, Client as PrismaClient } from '@prisma/client'

export class PrismaClientMapper {
  static toDomain(client: PrismaClient): SavedClient {
    return new SavedClient({
      email: client.email,
      id: client.id,
      name: client.name,
      password: client.password,
      balance: client.balance,
    })
  }

  static toPrisma(client: ClientInput): Prisma.ClientCreateInput {
    return {
      name: client.name,
      email: client.email,
      password: client.password,
      balance: client.balance ?? 0,
    }
  }
}
