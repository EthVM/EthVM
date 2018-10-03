import { Timestamp } from 'bson'

export interface Uncle {
  parendHash: string
  unclesHash: string
  timestamp: Timestamp
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
