import { Injectable } from '@nestjs/common'

const MAX_PAGE_SIZE = 100

@Injectable()
export class EthService {
  isValidAddress(address: string): boolean {
    return /^(0x)?([0-9a-fA-F]{40})$/.test(address)
  }

  isValidHash(hash: string): boolean {
    return /^0x[0-9a-fA-F]{64}|0xGENESIS_{17}[0-9a-fA-F]{40}$/.test(hash)
  }

  isBuffer(item: any, length: number = 0): boolean {
    return Buffer.isBuffer(item) && (item as Buffer).length === length
  }

  hexToBuffer(hex: string): Buffer {
    return Buffer.from(hex.toLowerCase().replace('0x', ''), 'hex')
  }

  removePrefix(hash: string): string {
    return hash.startsWith('0x') ? hash.replace('0x', '') : hash
  }

  isValidPageSize(page: number): boolean {
    return page >= 0
  }

  isValidLimitSize(limit: number): boolean {
    return limit >= 1 && limit <= MAX_PAGE_SIZE
  }
}
