import { toBlock } from '@app/server/modules/blocks'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Block, SmallBlock } from 'ethvm-common'

export interface BlocksRepository {
  getBlock(hash: string): Promise<Block | null>
  getBlocks(limit: number, page: number): Promise<Block[]>
  getBlockByNumber(no: number): Promise<Block | null>
  getBlocksMined(address: string, limit: number, page: number): Promise<SmallBlock[]>
}

export class MongoBlockRepository extends BaseMongoDbRepository implements BlocksRepository {
  public getBlock(hash: string): Promise<Block | null> {
    return this.db
      .collection(MongoEthVM.collections.blocks)
      .findOne({ 'header.hash': hash })
      .then(resp => {
        if (!resp) {
          return null
        }
        return toBlock(resp)
      })
  }

  public getBlocks(limit: number, page: number): Promise<Block[]> {
    return this.db
      .collection(MongoEthVM.collections.blocks)
      .find()
      .sort({ 'header.number': -1 })
      .skip(page)
      .limit(limit)
      .toArray()
      .then(resp => {
        const b: Block[] = []
        if (!resp) {
          return b
        }
        resp.forEach(block => b.unshift(toBlock(block)))
        return b
      })
  }

  public getBlockByNumber(no: number): Promise<Block | null> {
    return this.db
      .collection(MongoEthVM.collections.blocks)
      .findOne({ 'header.number': no })
      .then(resp => {
        if (!resp) {
          return null
        }
        return toBlock(resp)
      })
  }

  public getBlocksMined(address: string, limit: number, page: number): Promise<SmallBlock[]> {
    return this.db
      .collection(MongoEthVM.collections.blocks)
      .find({ 'header.author': address })
      .project({ hash: 1, number: 1 })
      .sort({ number: -1 })
      .skip(page)
      .limit(limit)
      .toArray()
      .then(resp => {
        const b: SmallBlock[] = []
        if (!resp) {
          return b
        }
        resp.forEach(block => b.push(block))
        return b
      })
  }
}
