export class Hex {
  public hexString: string

  constructor(_hex: Buffer) {
    this.hexString = '0x' + Buffer.from(_hex).toString('hex')
  }

  public toString(): string {
    return this.hexString
  }

  public toBuffer(): Buffer {
    return Buffer.from(this.hexString.substring(2), 'hex')
  }
}
