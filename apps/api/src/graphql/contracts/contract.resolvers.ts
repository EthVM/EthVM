import {Args, Query, Resolver} from '@nestjs/graphql'
import {ContractService} from '@app/dao/contract.service'
import {ParsePagePipe} from '@app/shared/validation/parse-page.pipe'
import {ParseAddressPipe} from '@app/shared/validation/parse-address.pipe'
import {ContractDto} from '@app/graphql/contracts/dto/contract.dto'
import {ParseLimitPipe} from '@app/shared/validation/parse-limit.pipe.1'
import {ContractsPageDto} from '@app/graphql/contracts/dto/contracts-page.dto'

@Resolver('Contract')
export class ContractResolvers {
  constructor(private readonly contractService: ContractService) {
  }

  @Query()
  async contractByAddress(@Args('address', ParseAddressPipe) address: string) {
    const entity = await this.contractService.findContractByAddress(address)
    return entity ? new ContractDto(entity) : null
  }

  @Query()
  async contractsCreatedBy(
    @Args('creator', ParseAddressPipe) creator: string,
    @Args('limit') limit: number,
    @Args('page') page: number,
  ): Promise<ContractsPageDto> {
    const results = await this.contractService.findContractsCreatedBy(creator, limit, page)
    return {
      items: results[0].map(e => new ContractDto(e)),
      totalCount: results[1],
    }
  }
}
