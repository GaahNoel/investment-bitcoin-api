import { Investment, SavedInvestment } from '@/domain/entities/investment'
import { DateObject } from '@/domain/value-objects/date'
import { Investment as PrismaInvestment, Prisma } from '@prisma/client'

export class PrismaInvestmentMapper {
  static toDomain(investment: PrismaInvestment): SavedInvestment {
    return new SavedInvestment({
      amount: investment.amount,
      bitcoinPrice: investment.bitcoinPrice,
      clientId: investment.clientId,
      date: new DateObject(investment.orderDate),
      id: investment.id,
      investmentValue: investment.investmentValue,
    })
  }

  static toPrisma(investment: Investment): Prisma.InvestmentCreateManyInput {
    return {
      amount: investment.amount,
      bitcoinPrice: investment.bitcoinPrice,
      clientId: investment.clientId,
      investmentValue: investment.investmentValue,
      orderDate: investment.date.value,
    }
  }
}
