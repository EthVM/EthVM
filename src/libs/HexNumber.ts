import Bn from 'bignumber.js'

class HexNumber {
  public value: string
  constructor(_value: Buffer) {
    this.value = '0x' + new Buffer(_value).toString('hex')
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
