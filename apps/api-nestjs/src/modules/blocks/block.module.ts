import { Module } from '@nestjs/common'
import { BlockEntity } from '@app/modules/blocks/block.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlockService } from '@app/modules/blocks/block.service'
import { BlockResolvers } from '@app/modules/blocks/block.resolvers'

@Module({
  imports: [TypeOrmModule.forFeature([BlockEntity])],
  providers: [BlockService, BlockResolvers],
  exports: [BlockService]
})
export class BlockModule {}
