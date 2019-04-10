import { Args, Query, Resolver } from '@nestjs/graphql'
import { AccountMetadataService } from '@app/modules/account-metadata/account-metadata.service'
import { AccountMetadataDto } from '@app/modules/account-metadata/account-metadata.dto'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'

@Resolver('AccountMetadata')
export class AccountMetadataResolvers {
  constructor(private readonly accountMetadataService: AccountMetadataService) {}

  @Query()
  async accountMetadataByHash(@Args('hash', ParseAddressPipe) hash: string): Promise<AccountMetadataDto | null> {
    const entity = await this.accountMetadataService.findAccountMetadataByHash(hash)
    return entity ? new AccountMetadataDto(entity) : null
  }
}
