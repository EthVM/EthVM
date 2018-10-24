import { BlocksRepository } from '@app/server/modules/blocks'
import { CacheRepository } from '@app/server/repositories'
import { Block } from 'ethvm-models'

export interface BlocksService {
  getBlocks(limit: number, page: number): Promise<Block[]>
  getBlock(hash: string): Promise<Block | null>
}

export class BlocksServiceImpl implements BlocksService {
  constructor(private readonly blocksRepository: BlocksRepository, private readonly cacheRepository: CacheRepository) {}

  public getBlocks(limit: number, page: number): Promise<Block[]> {
    return this.blocksRepository.getBlocks(limit, page)
  }

  public getBlock(hash: string): Promise<Block | null> {
    return this.blocksRepository.getBlock(hash)
  }
}
