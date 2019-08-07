import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BigNumberTransformer } from '@app/orm/transformers/big-number.transformer'
import BigNumber from 'bignumber.js'
import { DateTransformer } from '@app/orm/transformers/date.transformer'

@Entity('balance')
export class BalanceEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'character', length: 42, readonly: true })
  contract!: string

  @PrimaryColumn({ type: 'character', length: 42, readonly: true })
  address!: string

  @PrimaryColumn({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  tokenId?: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  amount!: BigNumber

  @Column({ type: 'timestamp', readonly: true, transformer: new DateTransformer() })
  timestamp!: Date

}
