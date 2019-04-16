import { Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('erc20_balance')
export class Erc20BalanceEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  contract!: string

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  address!: string

  @PrimaryColumn({type: 'numeric', readonly: true})
  amount!: string

}
