export interface Encrypter {
  encrypt(value: string): string
}

export interface HashComparer {
  compare(value: string, otherValue: string): boolean
}
