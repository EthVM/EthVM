import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountMetadataEntity } from '@app/orm/entities/account-metadata.entity'
import { AccountMetadataService } from '@app/modules/account-metadata/account-metadata.service'
import { AccountMetadataResolvers } from '@app/modules/account-metadata/account-metadata.resolvers'

@Module({
  imports: [TypeOrmModule.forFeature([AccountMetadataEntity])],
  providers: [AccountMetadataService, AccountMetadataResolvers],
  exports: []
})
export class AccountMetadataModule {}
