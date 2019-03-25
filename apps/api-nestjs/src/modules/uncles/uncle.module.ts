import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UncleEntity } from '@app/orm/entities/uncle.entity'
import { UncleService } from '@app/modules/uncles/uncle.service'
import { UncleResolvers } from '@app/modules/uncles/uncle.resolvers'

@Module({
  imports: [TypeOrmModule.forFeature([UncleEntity])],
  providers: [UncleService, UncleResolvers]
})
export class UncleModule {}
