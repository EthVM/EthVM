import { UncleResolvers } from '@app/modules/uncles/uncle.resolvers'
import { UncleService } from '@app/modules/uncles/uncle.service'
import { UncleEntity } from '@app/orm/entities-mongo/uncle.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([UncleEntity])],
  providers: [UncleService, UncleResolvers],
  exports: [UncleService],
})
export class UncleModule {}
