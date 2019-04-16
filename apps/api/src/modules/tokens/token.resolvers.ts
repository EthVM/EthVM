import { Args, Query, Resolver } from '@nestjs/graphql'
import { TokenService } from '@app/modules/tokens/token.service'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'
import { VmEngineService } from '@app/shared/vm-engine.service'
import { TokenTransferDto } from '@app/modules/tokens/dto/token-transfer.dto'
import { TokenHolderDto } from '@app/modules/tokens/dto/token-holder.dto'

@Resolver('Token')
export class TokenResolvers {
  constructor(private readonly tokenService: TokenService, private readonly vmEngine: VmEngineService) {
  }

  @Query()
  async addressTokenTransfers(
    @Args('address', ParseAddressPipe) address: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number,
  ) {
    const entities = await this.tokenService.findAddressTokenTransfers(address, limit, page)
    return entities.map(e => new TokenTransferDto(e))
  }

  @Query()
  async addressTokenTransfersByHolder(
    @Args('address', ParseAddressPipe) address: string,
    @Args('holder') holder: string,
    @Args('filter') filter?: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number,
  ) {
    const entities = await this.tokenService.findAddressTokenTransfersByHolder(address, holder, filter, limit, page)
    return entities.map(e => new TokenTransferDto(e))
  }

  @Query()
  async tokenHistory(@Args('address', ParseAddressPipe) address: string) {
    return this.tokenService.fetchTokenHistory(address)
  }

  @Query()
  async tokenHolders(@Args('address', ParseAddressPipe) address: string, @Args('limit', ParseLimitPipe) limit: number, @Args('page', ParsePagePipe) page: number): Promise<TokenHolderDto[]> {
    const entities = await this.tokenService.findTokenHolders(address, limit, page)
    return (entities as any[]).map(e => new TokenHolderDto(e))
  }

  @Query()
  async tokenHolder(@Args('address', ParseAddressPipe) address: string, @Args('holderAddress', ParseAddressPipe) holderAddress: string): Promise<TokenHolderDto | null> {
    const entity = await this.tokenService.findTokenHolder(address, holderAddress)
    return entity ? new TokenHolderDto(entity) : null
  }

  @Query()
  async holderTransfers(@Args('address', ParseAddressPipe) address: string, @Args('holderAddress', ParseAddressPipe) holderAddress: string) {
    return this.tokenService.fetchAddressHistory(address, holderAddress)
  }

  @Query()
  async addressAllTokensOwned(@Args('address', ParseAddressPipe) address: string) {
    return this.tokenService.findAddressAllTokensOwned(address)
  }

  @Query()
  async addressAmountTokensOwned(@Args('address', ParseAddressPipe) address: string) {
    return this.vmEngine.fetchAddressAmountTokensOwned(address)
  }
}
