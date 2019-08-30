import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import {BigNumberTransformer} from '@app/orm/transformers/big-number.transformer'
import {BigNumber} from 'bignumber.js'

@Entity('miner_block_count')
export class MinerBlockCountEntity {

  public constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'char', length: 42, readonly: true })
  author!: string

  @PrimaryColumn({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber!: BigNumber

  @Column({ type: 'bigint', readonly: true, transformer: new BigNumberTransformer() })
  count!: BigNumber

}
