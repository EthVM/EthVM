import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { BlockEntity } from '@app/orm/entities/block.entity'

@Injectable()
export class BlockService {
  constructor(@InjectRepository(BlockEntity) private readonly blockRepository: MongoRepository<BlockEntity>) {}

  async findBlockByHash(hash: string): Promise<BlockEntity | null> {
    return this.blockRepository.findOne({ where: { 'header.hash': hash } })
  }

  async findBlocks(limit: number = 10, page: number = 0): Promise<BlockEntity[]> {
    // TODO update to include fromBlock offset and add order DESC - cannot order by nested property with typeorm mongodb
    const skip = page * limit
    return this.blockRepository.find({ take: limit, skip })
  }

  async findBlockByNumber(number: number): Promise<BlockEntity | null> {
    return this.blockRepository.findOne({ where: { 'header.number': number } })
  }

  async findMinedBlocksByAddress(address: string, limit: number = 10, page: number = 0): Promise<BlockEntity[]> {
    const skip = page * limit
    return this.blockRepository.find({ where: { 'header.author': address }, take: limit, skip })
  }

  async findTotalNumberOfBlocks(): Promise<number> {
    return this.blockRepository.count()
  }

}
