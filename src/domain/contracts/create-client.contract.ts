import { ClientInput, SavedClient } from '../entities/client'

export interface CreateClient {
  handle(input: ClientInput): Promise<SavedClient>
}
