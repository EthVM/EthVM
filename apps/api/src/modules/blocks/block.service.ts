import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'

@Injectable()
export class BlockService {
  constructor(@InjectRepository(BlockHeaderEntity) private readonly blockHeaderRepository: Repository<BlockHeaderEntity>) {}

  async findBlockByHash(hash: string): Promise<BlockHeaderEntity | undefined> {
    // TODO map this in ParseHashPipe?
    hash = `0x${hash}`
    return this.blockHeaderRepository.findOne({ where: { hash }, relations: ['txs', 'txs.traces', 'txs.receipt'] })
  }

  async findBlocks(limit: number = 10, page: number = 0, fromBlock: number = 0): Promise<BlockHeaderEntity[]> {
    // TODO confirm use of fromBlock
    const skip = page * limit
    return this.blockHeaderRepository.find({ take: limit, skip, order: {number: 'DESC'}, relations: ['txs'] })
  }

  async findBlockByNumber(number: number): Promise<BlockHeaderEntity | undefined> {
    return this.blockHeaderRepository.findOne({ where: { number }, relations: ['txs', 'txs.traces', 'txs.receipt'] })
  }

  async findMinedBlocksByAddress(address: string, limit: number = 10, page: number = 0): Promise<BlockHeaderEntity[]> {
    // TODO map this in ParseAddressPipe?
    address = `0x${address}`
    // TODO check order by
    const skip = page * limit
    return this.blockHeaderRepository.find({ where: { author: address }, take: limit, skip })
  }

  async findTotalNumberOfBlocks(): Promise<number> {
    return this.blockHeaderRepository.count()
  }
}
