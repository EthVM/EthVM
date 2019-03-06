import { Module } from '@nestjs/common'
import { BlockEntity } from './block.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlockService } from './block.service'
import { BlockResolvers } from './block.resolvers'

@Module({
  imports: [TypeOrmModule.forFeature([BlockEntity])],
  providers: [BlockService, BlockResolvers],
  exports: [BlockService]
})
export class BlockModule {}
