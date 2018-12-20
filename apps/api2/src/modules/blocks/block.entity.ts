import {Entity,ObjectIdColumn,Column,ObjectID,PrimaryColumn,PrimaryGeneratedColumn} from "typeorm";

@Entity('blocks')
export class BlockEntity {
  @PrimaryColumn()
  number: number

  @Column()
  hash: string

  @Column()
  header: Header

  @Column()
  stats: BlockStats

  @Column()
  transactions?: string[]

  @Column()
  uncles?: string[]
}
export interface Header {
  parentHash: string
  sha3Uncles?: string
  timestamp?: number
  nonce?: string
  miner: string
  rewards: any
  difficulty?: number
  totalDifficulty?: number
  stateRoot: Buffer
  transactionsRoot?: Buffer
  receiptsRoot: Buffer
  logsBloom?: Buffer
  gasLimit?: number
  gasUsed?: number
  mixHash?: Buffer
  extraData?: Buffer
}

export interface BlockStats {
  successfulTxs?: number
  failedTxs?: number
  pendingTxs?: number
  processingTimeMs?: number
  txs?: number
  internalTxs?: number
  avgGasPrice?: number
  avgTxsFees?: number
  totalGasPrice?: number
  totalTxsFees?: number
}



