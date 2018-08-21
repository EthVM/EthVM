import { Log as LogLayout } from '@shared/server/modules/txs/txs.entities'

export interface TxLogLayout {
  hash: Buffer
  logs: LogLayout[]
}
