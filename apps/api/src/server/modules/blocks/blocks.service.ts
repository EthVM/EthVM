import { BlocksRepository } from '@app/server/modules/blocks'
import { Block } from 'ethvm-common'

export interface BlocksService {
  getBlocks(limit: number, page: number): Promise<Block[]>
  getBlock(hash: string): Promise<Block | null>
  getBlockByNumber(no: number): Promise<Block | null>
  getBlocksMined(address: string, limit: number, page: number): Promise<Block[]>
  getTotalNumberOfBlocks(): Promise<number>
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

  public getBlocksMined(address: string, limit: number, page: number): Promise<Block[]> {
    return this.blocksRepository.getBlocksMined(address, limit, page)
  }

  public getTotalNumberOfBlocks(): Promise<number> {
    return this.blocksRepository.getTotalNumberOfBlocks()
  }
}
