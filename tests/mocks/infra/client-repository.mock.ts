import { CreateClientRepository } from '@/domain/contracts/create-client-repository.contract'
import { FindClientRepository } from '@/domain/contracts/find-client-repository.contract'
import { UpdateClientRepository } from '@/domain/contracts/update-client-repository.contract'
import { ClientInput, SavedClient } from '@/domain/entities/client'
import { Mocked, vi } from 'vitest'

export const mockCreatedClientRepository = (params?: Partial<ClientInput>): Mocked<CreateClientRepository> => {
  return {
    create: vi.fn().mockResolvedValue(new SavedClient({
      id: 'any-id',
      email: 'any-email',
      name: 'any-name',
      password: 'any-password',
      balance: 100,
      ...params,
    })),
  }
}

export const mockFindClientRepository = (params?: Partial<ClientInput>): Mocked<FindClientRepository> => {
  return {
    find: vi.fn().mockResolvedValue(new SavedClient({
      id: 'any-id',
      email: 'any-email',
      name: 'any-name',
      password: 'any-password',
      balance: 100,
      ...params,
    })),
  }
}

export const mockUpdateClientRepository = (params?: Partial<ClientInput>): Mocked<UpdateClientRepository> => {
  return {
    update: vi.fn().mockResolvedValue(new SavedClient({
      id: 'any-id',
      email: 'any-email',
      name: 'any-name',
      password: 'any-password',
      balance: 100,
      ...params,
    })),
  }
}
