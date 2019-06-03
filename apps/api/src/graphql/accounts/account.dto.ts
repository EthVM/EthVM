import { Account } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import BigNumber from 'bignumber.js'

export class AccountDto implements Account {

  address!: string
  balance!: BigNumber
  inTxCount!: BigNumber
  isContractCreator!: boolean
  isMiner!: boolean
  outTxCount!: BigNumber
  totalTxCount!: BigNumber
  isContract!: boolean

  constructor(data: any) {
    assignClean(this, data)

    // default counts
    this.inTxCount = this.inTxCount || 0;
    this.outTxCount = this.outTxCount || 0;
    this.totalTxCount = this.totalTxCount || 0;
  }
}
