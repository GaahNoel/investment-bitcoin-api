import { ClientInput, SavedClientInput } from '@/domain/entities/client'

export const mockClientInput = (params: Partial<ClientInput> = {}): ClientInput => {
  return {
    email: 'any@mail.com',
    name: 'any-name',
    password: 'any-password',
    balance: 100,
    ...params,
  }
}

export const mockSavedClientInput = (params: Partial<SavedClientInput> = {}): SavedClientInput => {
  return {
    ...mockClientInput(params),
    id: 'any-id',
    ...params,
  }
}
