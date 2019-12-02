import { BigNumber, TokenHolder } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import {RawBalanceEntity} from '@app/graphql/balances/dto/balance.dto'
import {BalanceEntity} from '@app/orm/entities/balance.entity'

export class TokenHolderDto implements TokenHolder {

  address!: string
  balance!: BigNumber

  constructor(data: RawBalanceEntity | BalanceEntity) {
    assignClean(this, data)
  }
}
