import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlockService } from '@app/modules/blocks/block.service'
import { BlockResolvers } from '@app/modules/blocks/block.resolvers'
import { BlockEntity } from '@app/orm/entities/block.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BlockEntity])],
  providers: [BlockService, BlockResolvers],
  exports: [BlockService],
})
export class BlockModule {}
