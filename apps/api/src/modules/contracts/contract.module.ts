import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContractService } from '@app/modules/contracts/contract.service'
import { ContractResolvers } from '@app/modules/contracts/contract.resolvers'
import { ContractEntity } from '@app/orm/entities/contract.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [ContractService, ContractResolvers],
})
export class ContractModule {}
