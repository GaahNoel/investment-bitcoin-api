import { ClientInput, SavedClient } from '../entities/client'

export interface CreateClientRepository {
  create(input: ClientInput): Promise<SavedClient>
}
