import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { TraceCallActionRecordEmbedded } from '@app/orm/embedded-entities/block/trace-call-action-record.embedded'
import { TraceCreateActionRecordEmbedded } from '@app/orm/embedded-entities/block/trace-create-action-record.embedded'
import { TraceDestroyActionRecordEmbedded } from '@app/orm/embedded-entities/block/trace-destroy-action-record.embedded'
import { TraceRewardActionRecordEmbedded } from '@app/orm/embedded-entities/block/trace-reward-action-record.embedded'

export class ActionEmbedded {
  constructor(data: any) {
    assignClean(this, data)
  }

  @Column(type => TraceCallActionRecordEmbedded)
  TraceCallActionRecord!: TraceCallActionRecordEmbedded

  @Column(type => TraceCreateActionRecordEmbedded)
  TraceCreateActionRecord!: TraceCreateActionRecordEmbedded

  @Column(type => TraceDestroyActionRecordEmbedded)
  TraceDestroyActionRecord!: TraceDestroyActionRecordEmbedded

  @Column(type => TraceRewardActionRecordEmbedded)
  TraceRewardActionRecord!: TraceRewardActionRecordEmbedded
}
