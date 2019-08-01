import { BalanceNew } from '@app/graphql/schema'
import BigNumber from 'bignumber.js'
import { assignClean } from '@app/shared/utils'

export class BalanceDto implements BalanceNew {
  address!: string
  amount?: BigNumber
  contract?: string
  timestamp!: Date
  tokenId?: BigNumber

  constructor(data) {
    assignClean(this, data)
  }

}
