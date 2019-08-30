import { Column, Entity, PrimaryColumn } from 'typeorm'
import {assignClean} from '@app/shared/utils'
import {BigNumberTransformer} from '@app/orm/transformers/big-number.transformer'
import { BigNumber } from 'bignumber.js'
import {DateTransformer} from '@app/orm/transformers/date.transformer';

@Entity('sync_status_history')
export class SyncStatusHistoryEntity {
  public constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'varchar', length: 128, readonly: true })
  component!: string

  @PrimaryColumn({ type: 'decimal', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber!: BigNumber

  @Column({ type: 'timestamp', readonly: true, transformer: new DateTransformer() })
  timestamp!: Date

  @Column({ type: 'timestamp', readonly: true, transformer: new DateTransformer() })
  blockTimestamp!: Date
}
