class Hash {
  public hash: string
  constructor(_hash: Buffer) {
    this.hash = '0x' + new Buffer(_hash).toString('hex')
    this.hash = this.hash === '0x' ? '0x0' : this.hash
  }
  public toString(): string {
    return this.hash
  }
  public toBuffer(): Buffer {
    return new Buffer(this.hash.substring(2), 'hex')
  }
}
