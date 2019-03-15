import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TokenTransferEntity } from '@app/orm/entities/token-transfer.entity'
import { MongoRepository } from 'typeorm'

@Injectable()
export class TokenTransferService {
  constructor(
    @InjectRepository(TokenTransferEntity)
    private readonly tokenTransferRepository: MongoRepository<TokenTransferEntity>
  ) {}

  async findAddressTokenTransfers(address: string, take: number = 10, page: number = 0): Promise<TokenTransferEntity[]> {
    const skip = take * page
    return this.tokenTransferRepository.find({
      where: { contract: address, transferType: { $not: { $eq: 'ETHER' } } },
      take,
      skip,
      order: { timestamp: -1 }
    })
  }

  async findAddressTokenTransfersByHolder(
    address: string,
    holder: string,
    filter: string = 'all',
    take: number = 10,
    page: number = 0
  ): Promise<TokenTransferEntity[]> {
    const skip = take * page
    let where
    switch (filter) {
      case 'in':
        where = { contract: address, transferType: { $not: { $eq: 'ETHER' } }, from: holder }
        break
      case 'out':
        where = { contract: address, transferType: { $not: { $eq: 'ETHER' } }, to: holder }
        break
      default:
        where = { contract: address, transferType: { $not: { $eq: 'ETHER' } }, $or: [{ from: holder }, { to: holder }] }
        break
    }
    return this.tokenTransferRepository.find({ where, take, skip, order: { timestamp: -1 } })
  }
}
