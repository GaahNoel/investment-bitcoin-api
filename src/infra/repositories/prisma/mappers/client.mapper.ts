import { SavedClient } from '@/domain/entities/client'
import { Client as PrismaClient } from '@prisma/client'

export class PrismaClientMapper {
  static toDomain(client: PrismaClient): SavedClient {
    return new SavedClient({
      email: client.email,
      id: client.id,
      name: client.name,
      password: client.password,
      balance: client.balanceInCents,
    })
  }
}
