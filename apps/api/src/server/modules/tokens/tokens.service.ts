import { TokensRepository } from '@app/server/modules/tokens'
import { Token, TokenTransfer } from 'ethvm-common'
import { VmEngine } from '@app/server/modules/vm'

export interface TokensService {
  getAddressTokenTransfers(address: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]>
  getAddressAllTokensOwned(address: string): Promise<Token[]>
  getAddressAmountTokensOwned(address: string): Promise<number>
}

export class TokensServiceImpl implements TokensService {

  constructor(private readonly tokensRepository: TokensRepository, private readonly vme: VmEngine) {}

  public getAddressTokenTransfers(address: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]> {
    return this.tokensRepository.getAddressTokenTransfers(address, filter, limit, page)
  }

  public getAddressAllTokensOwned(address: string): Promise<Token[]> {
    return this.vme.getAddressAllTokensOwned(address)
  }

  public getAddressAmountTokensOwned(address: string): Promise<number> {
    return this.vme.getAddressAmountTokensOwned(address)
  }
}
