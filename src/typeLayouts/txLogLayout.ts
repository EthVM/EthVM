interface LogLayout {
  address: Buffer
  topics: Array<Buffer>
  data: Buffer
  blockNumber: Buffer
  txHash: Buffer
  txIndex: Buffer
  blockHash: Buffer
  index: Buffer
  removed: boolean
}

export default interface txLogLayout {
  hash: Buffer
  logs: Array<LogLayout>
}
