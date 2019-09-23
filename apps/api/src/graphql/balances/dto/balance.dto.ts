import { Balance } from '@app/graphql/schema'
import BigNumber from 'bignumber.js'
import { assignClean } from '@app/shared/utils'
import { ETH_ADDRESS } from '@app/shared/eth.service'

export interface RawBalanceEntity {
  address: string
  block_number: string
  contract_address: string
  block_hash: string
  token_type: string
  timestamp: string
  balance?: string
  token_id?: string
}

export class BalanceDto implements Balance {
  address!: string
  balance?: BigNumber
  contractAddress?: string
  timestamp!: Date
  tokenId?: BigNumber
  blockNumber!: BigNumber

  constructor(data: RawBalanceEntity) {
    assignClean(this, data)

    // Data is in raw DB form so map from snake-case to camel-case

    if (!data.contract_address) {
      this.contractAddress = ETH_ADDRESS
    } else {
      this.contractAddress = data.contract_address
    }
    this.tokenId = data.token_id ? new BigNumber(data.token_id) : undefined
    this.blockNumber = new BigNumber(data.block_number)
  }

}
