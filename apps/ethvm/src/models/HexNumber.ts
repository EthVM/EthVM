import Bn from 'bignumber.js'

export class HexNumber {
  public value: string

  constructor(raw: Buffer) {
    this.value = '0x' + new Buffer(raw).toString('hex')
    this.value = this.value === '0x' ? '0x0' : this.value
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
