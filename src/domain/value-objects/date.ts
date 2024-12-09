export class DateObject {
  private readonly _value: Date
  constructor(date: Date | string) {
    this._value = new Date(date)
  }

  public toShortString(): string {
    return this._value.toISOString().split('T')[0]
  }

  public get value(): Date {
    return this._value
  }
}
