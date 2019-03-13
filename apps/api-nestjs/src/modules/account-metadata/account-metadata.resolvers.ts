import { Args, Query, Resolver } from '@nestjs/graphql'
import { AccountMetadataService } from '@app/modules/account-metadata/account-metadata.service'
import { AccountMetadataDto } from '@app/modules/account-metadata/account-metadata.dto'

@Resolver('AccountMetadata')
export class AccountMetadataResolvers {
  constructor(private readonly accountMetadataService: AccountMetadataService) {}

  @Query()
  async accountMetadataByHash(@Args('hash') hash: string) {
    const entity = await this.accountMetadataService.findAccountMetadataByHash(hash)
    return entity ? new AccountMetadataDto(entity) : null
  }
}
