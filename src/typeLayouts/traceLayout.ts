interface transfer {
  op: string
  value: Buffer
  from: Buffer
  fromBalance: Buffer
  to: Buffer
  toBalance: Buffer
  input: Buffer
}

export default interface traceLayout {
  hash: Buffer
  trace: {
    isError: boolean
    msg: string
    transfers: Array<transfer>
  }
}
