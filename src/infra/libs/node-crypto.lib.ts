import { Encrypter } from '@/domain/contracts/encrypter.contract'
import crypto from 'node:crypto'

export class NodeCrypto implements Encrypter {
  private readonly salt: string
  constructor() {
    this.salt = crypto.randomBytes(128).toString('base64')
  }

  encypt(value: string): string {
    return crypto.scryptSync(value, this.salt, 32).toString('hex')
  }
}
