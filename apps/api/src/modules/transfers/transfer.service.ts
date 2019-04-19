import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, FindManyOptions, Repository } from 'typeorm'
import { FungibleBalanceTransferEntity } from '@app/orm/entities/fungible-balance-transfer.entity'

@Injectable()
export class TransferService {

  constructor(
    @InjectRepository(FungibleBalanceTransferEntity)
    private readonly transferRepository: Repository<FungibleBalanceTransferEntity>
  ) {
  }

  async findTokenTransfersByContractAddress(address: string, take: number = 10, page: number = 0): Promise<[FungibleBalanceTransferEntity[], number]> {
    const skip = take * page

    const findOptions: FindManyOptions = {
      where: {deltaType: 'TOKEN_TRANSFER', contractAddress: address},
      skip,
      take,
      order: {traceLocationBlockNumber: 'DESC', traceLocationTransactionIndex: 'DESC'}
    }
    return this.transferRepository.findAndCount(findOptions)
  }

  async findTokenTransfersByContractAddressForHolder(
    address: string,
    holder: string,
    filter: string = 'all',
    take: number = 10,
    page: number = 0,
  ): Promise<FungibleBalanceTransferEntity[]> {
    const skip = take * page

    const builder = this.transferRepository.createQueryBuilder('t')
      .where('t.contract_address = :address')
      .andWhere('t.delta_type = :deltaType')

    switch (filter) {
      case 'in':
        builder.andWhere('t.from = :holder')
        break
      case 'out':
        builder.andWhere('t.to = :holder')
        break
      default:
        builder.andWhere(new Brackets(sqb => {
          sqb.where('t.from = :holder')
          sqb.orWhere('t.to = :holder')
        }))
        break
    }

    return builder
      .setParameters({ address, deltaType: 'TOKEN_TRANSFER', holder })
      .orderBy('t.traceLocationBlockNumber', 'DESC')
      .addOrderBy('t.traceLocationTransactionIndex', 'DESC')
      .offset(skip)
      .take(take)
      .getMany()

  }

  async findInternalTransactionsByAddress(address: string, take: number = 10, page: number = 0): Promise<[FungibleBalanceTransferEntity[], number]> {
    const skip = take * page
    const deltaTypes = ['INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION']

    return this.transferRepository.createQueryBuilder('t')
      .where('t.delta_type IN (:...deltaTypes)')
      .andWhere(new Brackets(sqb => {
        sqb.where('t.from = :address')
        sqb.orWhere('t.to = :address')
      }))
      .setParameters({ deltaTypes, address })
      .orderBy('t.traceLocationBlockNumber', 'DESC')
      .addOrderBy('t.traceLocationTransactionIndex', 'DESC')
      .offset(skip)
      .limit(take)
      .getManyAndCount()

  }

}
