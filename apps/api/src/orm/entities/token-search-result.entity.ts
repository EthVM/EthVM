import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BigNumberTransformer } from '@app/orm/transformers/big-number.transformer'
import BigNumber from 'bignumber.js'

@Entity('token_search_result')
export class TokenSearchResultEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'character varying', readonly: true })
  address!: string

  @Column({ type: 'character varying', readonly: true })
  name?: string

  @Column({ type: 'character varying', readonly: true })
  symbol?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  currentPrice?: BigNumber

  @Column({ type: 'character varying', readonly: true })
  website?: string

  @Column({ type: 'character varying', readonly: true })
  logo?: string

}
