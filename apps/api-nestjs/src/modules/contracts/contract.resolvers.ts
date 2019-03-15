import { Args, Query, Resolver } from '@nestjs/graphql'
import { ContractService } from '@app/modules/contracts/contract.service'
import { ContractDto } from '@app/modules/contracts/contract.dto'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'

@Resolver('Contract')
export class ContractResolvers {
  constructor(private readonly contractService: ContractService) {}

  @Query()
  async contractByHash(@Args('hash', ParseAddressPipe) hash: string) {
    const entity = await this.contractService.findContractByHash(hash)
    return entity ? new ContractDto(entity) : null
  }

  @Query()
  async contractsCreatedBy(
    @Args('creator', ParseAddressPipe) creator: string,
    @Args('limit', ParseLimitPipe) limit: number,
    @Args('page') page: number
  ) {
    const entities = await this.contractService.findContractsCreatedBy(creator, limit, page)
    return entities.map(e => new ContractDto(e))
  }
}
