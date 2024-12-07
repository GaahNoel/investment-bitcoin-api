import { ClientInput, SavedClient } from '../entities/client'

export interface UpdateClientRepository {
  update(id: string, input: Partial<ClientInput>): Promise<SavedClient>
}
