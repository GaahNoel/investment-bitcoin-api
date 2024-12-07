import { SavedClient } from '../entities/client'

export type FindClientRepositoryInput = {
  email?: string
  id?: string
}

export interface FindClientRepository {
  find(input: FindClientRepositoryInput): Promise<SavedClient | undefined>
}
