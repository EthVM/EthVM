import { Balance } from '@app/graphql/schema'
import BigNumber from 'bignumber.js'
import { assignClean } from '@app/shared/utils'
import { ETH_ADDRESS } from '@app/shared/eth.service'

export class BalanceDto implements Balance {
  address!: string
  balance?: BigNumber
  contractAddress?: string
  timestamp!: Date
  tokenId?: BigNumber
  blockNumber!: BigNumber

  constructor(data) {
    assignClean(this, data)

    if (!data.contractAddress) {
      this.contractAddress = ETH_ADDRESS // Add ETH_ADDRESS to ether balances
    }

  }

}
