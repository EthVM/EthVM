import { BlocksRepository } from '@app/server/modules/blocks'
import { CacheRepository } from '@app/server/repositories'
import { Block, SmallBlock } from 'ethvm-common'

export interface BlocksService {
  getBlocks(limit: number, page: number): Promise<Block[]>
  getBlock(hash: string): Promise<Block | null>
  getBlocksMined(address: string, limit: number, page: number): Promise<SmallBlock[]>
}

export class BlocksServiceImpl implements BlocksService {
  constructor(private readonly blocksRepository: BlocksRepository, private readonly cacheRepository: CacheRepository) {}

  public getBlocks(limit: number, page: number): Promise<Block[]> {
    return this.blocksRepository.getBlocks(limit, page)
  }

  public getBlock(hash: string): Promise<Block | null> {
    return this.blocksRepository.getBlock(hash)
  }
  public getBlocksMined(address: string, limit: number, page: number): Promise<SmallBlock[]> {
    return this.blocksRepository.getBlocksMined(address, limit, page)
  }
}
