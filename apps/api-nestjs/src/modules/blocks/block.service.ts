import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { BlockEntity } from '@app/orm/entities/block.entity'

@Injectable()
export class BlockService {
  constructor(@InjectRepository(BlockEntity) private readonly blockRepository: MongoRepository<BlockEntity>) {}

  async getBlock(hash: string): Promise<BlockEntity> {
    // TODO fix find conditions
    return this.blockRepository.findOne({where: {hash: hash} })
  }

  async getBlocks(limit: number, page: number): Promise<BlockEntity[]> {
    let s = page * limit
    return this.blockRepository.find({ skip: s, take: limit })
  }
}
