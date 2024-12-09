import { SavedClient } from '../entities/client'

export interface GetClientById {
  handle(id: string): Promise<SavedClient | undefined>
}
