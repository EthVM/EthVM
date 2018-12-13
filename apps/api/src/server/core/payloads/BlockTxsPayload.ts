import { Pagination } from '@app/server/core/payloads'

export interface BlocksTxsPayload extends Pagination {
  hash: string
}
