import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlockService } from '@app/modules/blocks/block.service'
import { BlockResolvers } from '@app/modules/blocks/block.resolvers'
import { SubscriptionsModule } from '@app/subscriptions/subscriptions.module'
import { BlockEntity } from '@app/orm/entities-mongo/block.entity'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BlockHeaderEntity]), SubscriptionsModule],
  providers: [BlockService, BlockResolvers],
  exports: [BlockService],
})
export class BlockModule {}
