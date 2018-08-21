import Bn from 'bignumber.js'

export class HexTime {
  public time: string

  constructor(raw: Buffer) {
    this.time = '0x' + new Buffer(raw).toString('hex')
  }

  public toString(): string {
    return this.time
  }

  public toBuffer(): Buffer {
    return new Buffer(this.time.substring(2), 'hex')
  }

  public toDate(): Date {
    return new Date(new Bn(this.time).toNumber() * 1000)
  }
}
