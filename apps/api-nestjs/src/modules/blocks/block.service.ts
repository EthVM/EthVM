import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { BlockEntity } from '@app/orm/entities/block.entity'

@Injectable()
export class BlockService {
  constructor(@InjectRepository(BlockEntity) private readonly blockRepository: MongoRepository<BlockEntity>) {}

  async getBlock(hash: string): Promise<BlockEntity> {
    // TODO fix find conditions
    return this.blockRepository.findOne({where: { hash } })
  }

  async getBlocks(limit: number = 10, page: number = 0): Promise<BlockEntity[]> {
    const skip = page * limit
    return this.blockRepository.find({ take: limit, skip })
  }
}
