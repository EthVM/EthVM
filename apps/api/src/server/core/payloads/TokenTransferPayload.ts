import { Pagination } from '@app/server/core/payloads'

export interface TokenTransferPayload extends Pagination {
  address: string
}
