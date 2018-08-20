import { Block, BlocksRepository } from '@app/server/modules/blocks'
import { CacheRepository } from '@app/server/repositories'

export interface BlocksService {
  getBlocks(): Promise<Block[]>
  getBlock(hash: Buffer): Promise<Block | null>
}

export class BlocksServiceImpl implements BlocksService {
  constructor(private readonly blocksRepository: BlocksRepository, private readonly cacheRepository: CacheRepository) {}

  public getBlocks(): Promise<Block[]> {
    return this.cacheRepository.getBlocks()
  }

  public getBlock(hash: Buffer): Promise<Block | null> {
    return this.blocksRepository.getBlock(hash)
  }
}
