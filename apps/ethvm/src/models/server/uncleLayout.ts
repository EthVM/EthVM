
export interface UncleLayout {
  parentHash: string
  unclesHash: string
  timestamp: number
  nonce: Buffer
  miner?: string
  rewards?: any
  difficulty?: Buffer
  totalDifficulty?: Buffer
  stateRoot?: Buffer
  transactionsRoot?: Buffer
  receiptsRoot?: Buffer
  logsBloom?: Buffer
  gasLimit?: Buffer
  gasUsed?: number
  mixHash?: Buffer
  extraData?: Buffer
}
