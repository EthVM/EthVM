import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlockEntity } from '@app/orm/entities/block.entity'

@Injectable()
export class BlockService {
  constructor(@InjectRepository(BlockEntity) private readonly blockRepository: Repository<BlockEntity>) {}

  async getBlock(hash: string): Promise<BlockEntity> {
    return this.blockRepository.findOne({ hash: hash })
  }

  async getBlocks(limit: number, page: number): Promise<BlockEntity[]> {
    let s = page * limit
    return this.blockRepository.find({ skip: s, take: limit })
  }
}
