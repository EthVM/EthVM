import { TokensRepository } from '@app/server/modules/tokens'
import { VmEngine } from '@app/server/modules/vm'
import { Token, TokenTransfer } from 'ethvm-common'

export interface TokensService {
  getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]>
  getAddressTokenTransfersByHolder(address: string, holder: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]>
  getAddressAllTokensOwned(address: string): Promise<Token[]>
  getAddressAmountTokensOwned(address: string): Promise<number>
}

export class TokensServiceImpl implements TokensService {

  constructor(private readonly tokensRepository: TokensRepository, private readonly vme: VmEngine) {}

  public getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]> {
    return this.tokensRepository.getAddressTokenTransfers(address, limit, page)
  }

  public getAddressTokenTransfersByHolder(address: string, holder: string, filter: string = 'all', limit: number = 100, page: number = 0): Promise<TokenTransfer[]> {
    return this.tokensRepository.getAddressTokenTransfersByHolder(address, holder, filter, limit, page)
  }

  public getAddressAllTokensOwned(address: string): Promise<Token[]> {
    return this.vme.getAddressAllTokensOwned(address)
  }

  public getAddressAmountTokensOwned(address: string): Promise<number> {
    return this.vme.getAddressAmountTokensOwned(address)
  }
}
