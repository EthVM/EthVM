import Bn from 'bignumber.js'

class HexTime {
  public time: string
  constructor(_time: Buffer) {
    this.time = '0x' + new Buffer(_time).toString('hex')
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
