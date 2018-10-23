import { Block, toBlock } from '@app/server/modules/blocks'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'

export interface BlocksRepository {
  getBlocks(limit: number, page: number): Promise<Block[]>
  getBlock(hash: string): Promise<Block | null>
}

export class MongoBlockRepository extends BaseMongoDbRepository implements BlocksRepository {
  public getBlocks(limit: number, page: number): Promise<Block[]> {
    return this.db
      .collection(MongoEthVM.collections.blocks)
      .find()
      .sort({ number: -1 })
      .skip(page)
      .limit(limit)
      .toArray()
      .then(resp => {
        const b: Block[] = []
        if (!resp) {
          return b
        }
        resp.forEach(block => {
          b.push(toBlock(block))
        })
        return b
      })
  }

  public getBlock(hash: string): Promise<Block | null> {
    return this.db
      .collection(MongoEthVM.collections.blocks)
      .findOne({ hash })
      .then(resp => {
        if (!resp) {
          return null
        }
        return toBlock(resp)
      })
  }
}
