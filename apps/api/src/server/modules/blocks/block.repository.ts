import { toBlock } from '@app/server/modules/blocks'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Block } from 'ethvm-common'

export interface BlocksRepository {
  getBlock(hash: string): Promise<Block | null>
  getBlocks(format: string, limit: number, page: number, fromBlock: number): Promise<Block[]>
  getBlockByNumber(no: number): Promise<Block | null>
  getBlocksMined(address: string, limit: number, page: number): Promise<Block[]>
  getTotalNumberOfBlocks(): Promise<number>
}

export class MongoBlockRepository extends BaseMongoDbRepository implements BlocksRepository {
  public getBlock(hash: string): Promise<Block | null> {
    return this.db
      .collection(MongoEthVM.collections.blocks)
      .findOne({ 'header.hash': hash })
      .then(resp => resp ? toBlock(resp) : null)
  }

  public async getBlocks(format: string = 'full', limit: number, page: number, fromBlock: number = -1): Promise<Block[]> {
    const offset = fromBlock !== -1 ? fromBlock : await this.getTotalNumberOfBlocks()
    const start = offset - (page * limit)
    const projection = format === 'simple' ? MongoEthVM.projections.blocks.simple : {}

    return this.db
      .collection(MongoEthVM.collections.blocks)
      .find({ _id: {$lte: start} })
      .project(projection)
      .sort({ _id: -1 })
      .limit(limit)
      .toArray()
      .then(resp => resp ? resp.map(block => toBlock(block, format)) : [])
  }

  public getBlockByNumber(no: number): Promise<Block | null> {
    return this.db
      .collection(MongoEthVM.collections.blocks)
      .findOne({ _id: no })
      .then(resp => resp ? toBlock(resp) : null)
  }

  public getBlocksMined(address: string, limit: number, page: number): Promise<Block[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.blocks)
      .find({ 'header.author': address })
      .sort({ number: -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => resp ? resp.map(block => toBlock(block)) : [])
  }

  public getTotalNumberOfBlocks(): Promise<number> {
    return this.db.collection(MongoEthVM.collections.blocks).estimatedDocumentCount()
  }
}
