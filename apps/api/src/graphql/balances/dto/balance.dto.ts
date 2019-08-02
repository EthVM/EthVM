import { BalanceNew } from '@app/graphql/schema'
import BigNumber from 'bignumber.js'
import { assignClean } from '@app/shared/utils'
import { ETH_ADDRESS } from '@app/shared/eth.service'

export class BalanceDto implements BalanceNew {
  address!: string
  amount?: BigNumber
  contract?: string
  timestamp!: Date
  tokenId?: BigNumber

  constructor(data) {
    assignClean(this, data)
    if (data.contract === '') {
      this.contract = ETH_ADDRESS
    }
  }

}
