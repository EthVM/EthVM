import { BlocksRepository } from '@app/server/modules/blocks'
import { Block, SmallBlock } from 'ethvm-common'

export interface BlocksService {
  getBlocks(limit: number, page: number): Promise<Block[]>
  getBlock(hash: string): Promise<Block | null>
  getBlockByNumber(no: number): Promise<Block | null>
  getBlocksMined(address: string, limit: number, page: number): Promise<SmallBlock[]>
}

export class BlocksServiceImpl implements BlocksService {
  constructor(private readonly blocksRepository: BlocksRepository) {}

  public getBlocks(limit: number, page: number): Promise<Block[]> {
    return this.blocksRepository.getBlocks(limit, page)
  }

  public getBlock(hash: string): Promise<Block | null> {
    return this.blocksRepository.getBlock(hash)
  }

  public getBlockByNumber(no: number): Promise<Block | null> {
    return this.blocksRepository.getBlockByNumber(no)
  }

  public getBlocksMined(address: string, limit: number, page: number): Promise<SmallBlock[]> {
    return this.blocksRepository.getBlocksMined(address, limit, page)
  }
}
