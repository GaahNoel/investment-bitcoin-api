export class InvalidInputError extends Error {
  constructor(field: string, message?: string) {
    super(message ?? `InvalidInputError - ${field} is incorrect`)
  }
}
