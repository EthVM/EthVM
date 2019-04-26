import { UncleResolvers } from '@app/modules/uncles/uncle.resolvers'
import { UncleService } from '@app/modules/uncles/uncle.service'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UncleEntity } from '@app/orm/entities/uncle.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UncleEntity])],
  providers: [UncleService, UncleResolvers],
  exports: [UncleService],
})
export class UncleModule {}
