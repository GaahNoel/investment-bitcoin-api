import { Deposit, SavedDeposit } from '@/domain/entities/deposit'
import { DateObject } from '@/domain/value-objects/date'
import { Deposit as PrismaDeposit, Prisma } from '@prisma/client'

export class PrismaDepositMapper {
  static toDomain(deposit: PrismaDeposit): SavedDeposit {
    return new SavedDeposit({
      amount: deposit.valueInCents,
      clientId: deposit.clientId,
      date: new DateObject(deposit.depositDate),
      id: deposit.id,
    })
  }

  static toPrisma(deposit: Deposit): Prisma.DepositCreateManyInput {
    return {
      valueInCents: deposit.amount,
      clientId: deposit.clientId,
      depositDate: deposit.date.value,
    }
  }
}
