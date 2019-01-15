import { TokensRepository } from '@app/server/modules/tokens'
import { TokenTransfer } from 'ethvm-common'

export interface TokensService {
  getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]>
}

export class TokensServiceImpl implements TokensService {
  constructor(private readonly tokensRepository: TokensRepository) {}

  public getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]> {
    return this.tokensRepository.getAddressTokenTransfers(address, limit, page)
  }
}
