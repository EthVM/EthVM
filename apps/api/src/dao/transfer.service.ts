import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, FindManyOptions, Repository } from 'typeorm'
import { FungibleBalanceTransferEntity } from '@app/orm/entities/fungible-balance-transfer.entity'

@Injectable()
export class TransferService {

  constructor(
    @InjectRepository(FungibleBalanceTransferEntity)
    private readonly transferRepository: Repository<FungibleBalanceTransferEntity>,
  ) {
  }

  async findTokenTransfersByContractAddress(address: string, take: number = 10, page: number = 0): Promise<[FungibleBalanceTransferEntity[], number]> {
    const skip = take * page

    const findOptions: FindManyOptions = {
      where: {deltaType: 'TOKEN_TRANSFER', contractAddress: address},
      skip,
      take,
      order: {traceLocationBlockNumber: 'DESC', traceLocationTransactionIndex: 'DESC'},
    }
    return this.transferRepository.findAndCount(findOptions)
  }

  async findTokenTransfersByContractAddressForHolder(
    address: string,
    holder: string,
    filter: string = 'all',
    take: number = 10,
    page: number = 0,
  ): Promise<[FungibleBalanceTransferEntity[], number]> {
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
      .getManyAndCount()

  }

  /**
   * The difference between this query and findTokenTransfersByContractAddressForHolder
   * is that this query:
   *
   * 1) Accepts an array of possible token contractAddresses
   * 2) Accepts timestampTo/timestampFrom and sorts accordingly
   */
  async findTokenTransfersByContractAddressesForHolder(
    addresses: string[],
    holder: string,
    filter: string = 'all',
    take: number = 10,
    page: number = 0,
    timestampFrom: number = 0,
    timestampTo: number = 0,
  ): Promise<[FungibleBalanceTransferEntity[], number]> {
    const skip = take * page

    const builder = this.transferRepository.createQueryBuilder('t')
      .where('t.contract_address = ANY(:addresses)')
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

    if (timestampFrom > 0) {
      builder.andWhere(new Brackets(sqb => {
        sqb.where('t.timestamp > :timestampFrom')
      }))
    }

    if (timestampTo > 0) {
      builder.andWhere(new Brackets(sqb => {
        sqb.where('t.timestamp < :timestampTo')
      }))
    }

    return builder
      .setParameters({ addresses, deltaType: 'TOKEN_TRANSFER', holder, timestampFrom, timestampTo })
      .orderBy('t.timestamp', 'DESC')
      .offset(skip)
      .take(take)
      .getManyAndCount()

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
