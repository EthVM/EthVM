import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContractEntity } from '@app/orm/entities-mongo/contract.entity'
import { ContractService } from '@app/modules/contracts/contract.service'
import { ContractResolvers } from '@app/modules/contracts/contract.resolvers'

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [ContractService, ContractResolvers],
  exports: [],
})
export class ContractModule {}
