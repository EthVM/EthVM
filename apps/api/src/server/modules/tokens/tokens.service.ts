import { TokensRepository } from '@app/server/modules/tokens'
import { VmEngine } from '@app/server/modules/vm'
import { Token, TokenTransfer } from 'ethvm-common'
import { ExchangeRepository } from '../exchanges'

export interface TokensService {
  getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]>
  getAddressTokenTransfersByHolder(address: string, holder: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]>
  getAddressAllTokensOwned(address: string): Promise<Token[]>
  getAddressAmountTokensOwned(address: string): Promise<number>
}

export class TokensServiceImpl implements TokensService {
  constructor(private readonly tokensRepository: TokensRepository, private readonly exchangeRepository: ExchangeRepository, private readonly vme: VmEngine) {}

  public getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]> {
    return this.tokensRepository.getAddressTokenTransfers(address, limit, page)
  }

  public getAddressTokenTransfersByHolder(
    address: string,
    holder: string,
    filter: string = 'all',
    limit: number = 100,
    page: number = 0
  ): Promise<TokenTransfer[]> {
    return this.tokensRepository.getAddressTokenTransfersByHolder(address, holder, filter, limit, page)
  }

  public async getAddressAllTokensOwned(address: string): Promise<Token[]> {
    const tokens = await this.vme.getAddressAllTokensOwned(address)
    return Promise.all(
      tokens.map(async token => {
        const rate = await this.exchangeRepository.getTokenExchangeRateByAddress(token.addr.replace('0x', ''))
        token.currentPrice = rate ? rate.current_price : 0
        return token
      })
    )
  }

  public getAddressAmountTokensOwned(address: string): Promise<number> {
    return this.vme.getAddressAmountTokensOwned(address)
  }
}
