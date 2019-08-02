import { DeltaType, Transfer } from '@app/graphql/schema'
import { BalanceDeltaEntity } from '@app/orm/entities/balance-delta.entity'
import { assignClean } from '@app/shared/utils'
import BigNumber from 'bignumber.js'

export class BalanceDeltaDto implements Transfer {
  amount?: BigNumber
  contractAddress?: string
  deltaType!: DeltaType
  from?: string
  id!: string
  timestamp!: Date
  to!: string
  tokenId?: BigNumber
  tokenType?: string
  traceLocationBlockHash!: string
  traceLocationBlockNumber!: BigNumber
  traceLocationLogIndex?: number
  traceLocationTraceAddress!: string
  traceLocationTransactionHash!: string
  traceLocationTransactionIndex!: number

  constructor(data: BalanceDeltaEntity) {
    assignClean(this, data)

    // Assign "to" and "from" depending on "isReceiving" flag
    this.to = data.isReceiving ? data.address : data.counterpartAddress!
    this.from = data.isReceiving ? data.counterpartAddress : data.address
  }

}
