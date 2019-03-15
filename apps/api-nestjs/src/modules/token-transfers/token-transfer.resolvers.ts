import { Args, Query, Resolver } from '@nestjs/graphql'
import { TokenTransferService } from '@app/modules/token-transfers/token-transfer.service'
import { TokenExchangeRateDto } from '@app/modules/exchanges/token-exchange-rate.dto'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'

@Resolver('TokenTransfer')
export class TokenTransferResolvers {
  constructor(private readonly tokenTransferService: TokenTransferService) {}

  @Query()
  async addressTokenTransfers(
    @Args('address', ParseAddressPipe) address: string,
    @Args('limit') limit?: number,
    @Args('page') page?: number
  ) {
    const entities = await this.tokenTransferService.findAddressTokenTransfers(address, limit, page)
    return entities.map(e => new TokenExchangeRateDto(e))
  }

  @Query()
  async addressTokenTransfersByHolder(
    @Args('address') address: string,
    @Args('holder') holder: string,
    @Args('filter') filter?: string,
    @Args('limit') limit?: number,
    @Args('page') page?: number
  ) {
    const entities = await this.tokenTransferService.findAddressTokenTransfersByHolder(address, holder, filter, limit, page)
    return entities.map(e => new TokenExchangeRateDto(e))
  }
}
