import {DeltaType, Transfer} from '@app/graphql/schema'
import {assignClean} from '@app/shared/utils'
import BigNumber from 'bignumber.js'
import {BalanceDeltaEntity} from '@app/orm/entities/balance-delta.entity'

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
  blockHash!: string
  blockNumber!: BigNumber
  traceAddress!: string
  transactionHash!: string

  constructor(data: BalanceDeltaEntity) {
    assignClean(this, data)
    // Assign "to" and "from" depending on "isReceiving" flag
    this.to = data.isReceiving ? data.address! : data.counterpartAddress!
    this.from = data.isReceiving ? data.counterpartAddress : data.address
  }

}
