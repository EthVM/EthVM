import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BigNumberTransformer } from '@app/orm/transformers/big-number.transformer'
import BigNumber from 'bignumber.js'
import { DateTransformer } from '@app/orm/transformers/date.transformer'

@Entity('balance_delta')
export class BalanceDeltaEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'bigint', readonly: true })
  id!: string

  @Column({ type: 'char', length: 42, readonly: true })
  address!: string

  @Column({ type: 'char', length: 42, readonly: true })
  contractAddress?: string

  @Column({ type: 'char', length: 42, readonly: true })
  counterpartAddress?: string

  @Column({ type: 'varchar', length: 32, readonly: true })
  tokenType!: string

  @Column({ type: 'varchar', length: 32, readonly: true })
  deltaType!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  amount?: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  tokenId?: BigNumber

  @Column({ type: 'char', length: 66, readonly: true })
  blockHash?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber?: BigNumber

  @Column({ type: 'int', readonly: true })
  transactionIndex?: number

  @Column({ type: 'char', length: 66, readonly: true })
  transactionHash?: string

  @Column({ type: 'text', readonly: true})
  traceAddress?: string

  @Column({ type: 'timestamp', readonly: true, transformer: new DateTransformer() })
  timestamp!: Date

  @Column({ type: 'boolean', readonly: true })
  isReceiving!: boolean

}
