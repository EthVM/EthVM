import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BigNumberTransformer } from '@app/orm/transformers/big-number.transformer'
import BigNumber from 'bignumber.js'

@Entity('token_holder')
export class TokenHolderEntity {
  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'character', readonly: true })
  contract!: string

  @PrimaryColumn({ type: 'character', readonly: true })
  address!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  balance?: BigNumber

  @Column({ type: 'character', readonly: true })
  type!: string
}
