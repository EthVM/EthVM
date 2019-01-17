export class Hash {
  private hash: string

  constructor(raw: Buffer | string) {
    if (raw instanceof Buffer) {
      this.hash = '0x' + Buffer.from(raw).toString('hex')
      this.hash = this.hash === '0x' ? '0x0' : this.hash
      return
    }

    if (typeof raw === 'string') {
      this.hash = raw.startsWith('0x') ? raw : '0x' + raw
      return
    }

    this.hash = '0x0'
  }

  public toString(): string {
    return this.hash
  }

  public toBuffer(): Buffer {
    return Buffer.from(this.hash.substring(2), 'hex')
  }
}
