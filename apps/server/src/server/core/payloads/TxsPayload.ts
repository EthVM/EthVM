import { Pagination } from '@app/server/core/payloads'

export interface TxsPayload extends Pagination {
  address: string
}
