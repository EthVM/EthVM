import Bn from 'bignumber.js'

export class HexNumber {
  private value: string

  constructor(raw: Buffer | string) {
    if (raw instanceof Buffer) {
      this.value = '0x' + Buffer.from(raw).toString('hex')
      this.value = this.value === '0x' ? '0x0' : this.value
      return
    }

    if (typeof raw === 'string') {
      this.value = raw
      return
    }

    this.value = '0'
  }

  public toNumber(): string {
    return new Bn(this.value).toFixed()
  }

  public toIntNumber(): number {
    return new Bn(this.value).toNumber()
  }

  public toString(): string {
    return this.value
  }
}
