import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'

@Injectable()
export class BlockService {
  constructor(@InjectRepository(BlockHeaderEntity) private readonly blockRepository: MongoRepository<BlockHeaderEntity>) {}

  async findBlockByHash(hash: string): Promise<BlockHeaderEntity | undefined> {
    return this.blockRepository.findOne({ where: { 'header.hash': hash } })
  }

  async findBlocks(limit: number = 10, page: number = 0): Promise<BlockHeaderEntity[]> {
    // TODO update to include fromBlock offset and add order DESC - cannot order by nested property with typeorm mongodb
    const skip = page * limit
    return this.blockRepository.find({ take: limit, skip })
  }

  async findBlockByNumber(number: number): Promise<BlockHeaderEntity | undefined> {
    return this.blockRepository.findOne({ where: { 'header.number': number } })
  }

  async findMinedBlocksByAddress(address: string, limit: number = 10, page: number = 0): Promise<BlockHeaderEntity[]> {
    const skip = page * limit
    return this.blockRepository.find({ where: { 'header.author': address }, take: limit, skip })
  }

  async findTotalNumberOfBlocks(): Promise<number> {
    return this.blockRepository.count()
  }
}
