import { Block } from '@app/server/modules/blocks'

export interface BlocksRepository {
  getBlocks(limit: number, page: number): Promise<Block[]>
  getBlock(hash: string): Promise<Block | null>
}

export class MockBlockRepository implements BlocksRepository {
  public getBlocks(limit: number, page: number): Promise<Block[]> {
    const start = page * limit
    const end = start + limit
    return Promise.reject()
  }

  public getBlock(hash: string): Promise<Block | null> {
    return Promise.reject()
  }
}
