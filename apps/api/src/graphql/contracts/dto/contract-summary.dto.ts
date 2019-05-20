import { ContractSummary } from '@app/graphql/schema'
import BigNumber from 'bignumber.js'
import { assignClean } from '@app/shared/utils'

export class ContractSummaryDto implements ContractSummary {
  address!: string
  creator!: string
  blockNumber!: BigNumber;
  txHash!: string;
  timestamp!: number
  txFee!: BigNumber

  constructor(data: any) {
    assignClean(this, data)
  }
}
