interface Transfer {
  op: string
  value: Buffer
  from: Buffer
  fromBalance: Buffer
  to: Buffer
  toBalance: Buffer
  input: Buffer
}

export default interface TraceLayout {
  hash: Buffer
  trace: {
    isError: boolean
    msg: string
    transfers: Transfer[]
  }
}
