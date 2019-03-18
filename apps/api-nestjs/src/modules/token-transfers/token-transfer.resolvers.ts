import { Args, Query, Resolver } from '@nestjs/graphql'
import { TokenTransferService } from '@app/modules/token-transfers/token-transfer.service'
import { TokenExchangeRateDto } from '@app/modules/exchanges/token-exchange-rate.dto'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'

@Resolver('TokenTransfer')
export class TokenTransferResolvers {
  constructor(private readonly tokenTransferService: TokenTransferService) {}

  @Query()
  async addressTokenTransfers(
    @Args('address', ParseAddressPipe) address: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number
  ) {
    const entities = await this.tokenTransferService.findAddressTokenTransfers(address, limit, page)
    return entities.map(e => new TokenExchangeRateDto(e))
  }

  @Query()
  async addressTokenTransfersByHolder(
    @Args('address', ParseAddressPipe) address: string,
    @Args('holder') holder: string,
    @Args('filter') filter?: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number
  ) {
    const entities = await this.tokenTransferService.findAddressTokenTransfersByHolder(address, holder, filter, limit, page)
    return entities.map(e => new TokenExchangeRateDto(e))
  }

  @Query()
  async tokenHistory(@Args('address', ParseAddressPipe) address: string) {
    return this.tokenTransferService.fetchTokenHistory(address)
  }

  @Query()
  async topTokenHolders(@Args('address', ParseAddressPipe) address: string) {
    return this.tokenTransferService.fetchTokenHolders(address)
  }

  @Query()
  async holderDetails(@Args('address', ParseAddressPipe) address: string, @Args('holderAddress', ParseAddressPipe) holderAddress: string) {
    return this.tokenTransferService.fetchAddressInfo(address, holderAddress)
  }

  @Query()
  async holderTransfers(@Args('address', ParseAddressPipe) address: string, @Args('holderAddress', ParseAddressPipe) holderAddress: string) {
    return this.tokenTransferService.fetchAddressHistory(address, holderAddress)
  }
}
