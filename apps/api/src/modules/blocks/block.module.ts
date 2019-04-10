import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlockService } from '@app/modules/blocks/block.service'
import { BlockResolvers } from '@app/modules/blocks/block.resolvers'
import { BlockEntity } from 'block-header.entity.ts'
import { SubscriptionsModule } from '@app/subscriptions/subscriptions.module'

@Module({
  imports: [TypeOrmModule.forFeature([BlockEntity]), SubscriptionsModule],
  providers: [BlockService, BlockResolvers],
  exports: [BlockService],
})
export class BlockModule {}
