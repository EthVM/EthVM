import Bn from 'bignumber.js'

export class HexTime {
  public time: string

  constructor(_time: Buffer) {
    this.time = '0x' + Buffer.from(_time).toString('hex')
  }

  public toString(): string {
    return this.time
  }

  public toBuffer(): Buffer {
    return Buffer.from(this.time.substring(2), 'hex')
  }

  public toDate(): Date {
    return new Date(new Bn(this.time).toNumber() * 1000)
  }
}
