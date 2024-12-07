import { Encrypter, HashComparer } from '@/domain/contracts/encrypter.contract'
import crypto from 'node:crypto'

export class NodeCrypto implements Encrypter, HashComparer {
  private readonly salt: string
  constructor() {
    this.salt = crypto.randomBytes(128).toString('base64')
  }

  encrypt(value: string): string {
    return `${this.salt}.${crypto.scryptSync(value, this.salt, 64).toString('hex')}`
  }

  compare(encryptedValue: string, notEncryptedValue: string): boolean {
    const [salt, hashedValue] = encryptedValue.split('.')
    const hashedNotEncryptedValue = crypto.scryptSync(notEncryptedValue, salt, 64).toString('hex')

    return hashedValue === hashedNotEncryptedValue
  }
}
