class Hex {
  public hexString: string
  constructor(_hex: Buffer) {
    this.hexString = '0x' + new Buffer(_hex).toString('hex')
  }
  public toString(): string {
    return this.hexString
  }
  public toBuffer(): Buffer {
    return new Buffer(this.hexString.substring(2), 'hex')
  }
}
