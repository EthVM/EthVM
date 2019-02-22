export class LogRecord {

  address: Buffer
  data: Buffer
  topics: Buffer[]

  constructor(props) {
    Object.assign(this, props)
  }
}
