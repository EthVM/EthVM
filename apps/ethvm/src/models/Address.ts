export class Address {
  public address: string

  constructor(raw: Buffer) {
    if (raw) {
      this.address = '0x' + new Buffer(raw).toString('hex')
      this.address = this.address === '0x' ? '0x0000000000000000000000000000000000000000' : this.address
    } else {
      this.address = null
    }
  }

  public toString(): string {
    return this.address
  }

  public toBuffer(): Buffer {
    return new Buffer(this.address.substring(2), 'hex')
  }

  public toNakedAddress(): string {
    return this.address.toLowerCase().replace('0x', '')
  }
}
