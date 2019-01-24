import { TokensRepository } from '@app/server/modules/tokens'
import { TokenTransfer } from 'ethvm-common'
import { VmEngine } from '@app/server/modules/vm'

export interface TokensService {
  getAddressTokenTransfers(address: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]>
  getAddressTokenBalance(address: string): Promise<any>
  getAddressAmountTokensOwned(address: string): Promise<number>
}

export class TokensServiceImpl implements TokensService {

  constructor(private readonly tokensRepository: TokensRepository, private readonly vme: VmEngine) {}

  public getAddressTokenTransfers(address: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]> {
    return this.tokensRepository.getAddressTokenTransfers(address, filter, limit, page)
  }

  public getAddressTokenBalance(address: string): Promise<any> {
    return this.vme.getAllTokens(address)
  }

  public getAddressAmountTokensOwned(address: string): Promise<number> {
    return this.vme.getAddressAmountTokensOwned(address)
  }
}
