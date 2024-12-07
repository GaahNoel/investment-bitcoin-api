import { InvalidInputError } from '../errors/invalid-input.error'

export type ClientInput = {
  name: string
  email: string
  password: string
  balance?: number
}

export type ClientDTO = {
  name: string
  email: string
  balance?: number
}

export type SavedClientInput = ClientInput & {
  id: string
}

export type SavedClientDTO = ClientDTO & {
  id: string
}

export class Client {
  private readonly _name: string
  private readonly _email: string
  private readonly _password: string
  private _balance: number

  constructor(input: ClientInput) {
    this._name = input.name
    this._email = input.email
    this._password = input.password
    this._balance = 0
    this.addBalance(input.balance ?? 0)
  }

  public get name(): string {
    return this._name
  }

  public get email(): string {
    return this._email
  }

  public get balance(): number {
    return this._balance
  }

  public addBalance(amount: number) {
    if (amount < 0) {
      throw new InvalidInputError('amount', 'Cannot add an amount lower than zero')
    }

    this._balance += amount
  }

  public subtractBalance(amount: number) {
    if (amount <= 0) {
      throw new Error('Cannot subtract an amount lower than zero')
    }

    this._balance -= amount
  }

  public getDTO(): ClientDTO {
    return {
      email: this._email,
      name: this._name,
      balance: this._balance,
    }
  }
}

export class SavedClient extends Client {
  private readonly _id: string

  constructor(input: SavedClientInput) {
    const { id, ...clientInput } = input

    super(clientInput)

    this._id = id
  }

  public get id(): string {
    return this._id
  }

  public override getDTO(): SavedClientDTO {
    return {
      ...super.getDTO(),
      id: this._id,
    }
  }
}
