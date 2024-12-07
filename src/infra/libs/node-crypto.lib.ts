import { Encrypter, HashComparer } from '@/domain/contracts/encrypter.contract'
import crypto from 'node:crypto'

export class NodeCrypto implements Encrypter, HashComparer {
  encrypt(value: string): string {
    const salt = crypto.randomBytes(128).toString('base64')
    return `${salt}.${crypto.scryptSync(value, salt, 64).toString('hex')}`
  }

  compare(encryptedValue: string, notEncryptedValue: string): boolean {
    const [salt, hashedValue] = encryptedValue.split('.')
    const hashedNotEncryptedValue = crypto.scryptSync(notEncryptedValue, salt, 64).toString('hex')

    return hashedValue === hashedNotEncryptedValue
  }
}
