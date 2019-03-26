export class Address {
  public address: string

  constructor(_add: Buffer) {
    if (_add && Buffer.from(_add).toString('hex') !== '') {
      this.address = '0x' + Buffer.from(_add).toString('hex')
    } else {
      this.address = '0x0000000000000000000000000000000000000000'
    }
  }

  public toString(): string {
    return this.address
  }

  public toBuffer(): Buffer {
    return Buffer.from(this.address.substring(2), 'hex')
  }

  public toNakedAddress(): string {
    return this.address.toLowerCase().replace('0x', '')
  }
}
