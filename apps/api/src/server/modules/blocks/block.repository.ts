import { toBlock } from '@app/server/modules/blocks'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Block } from 'ethvm-common'

export interface BlocksRepository {
  getBlock(hash: string): Promise<Block | null>
  getBlocks(limit: number, page: number): Promise<Block[]>
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

  public getBlocks(limit: number, page: number): Promise<Block[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.blocks)
      .find()
      .sort({ 'header.number': -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => resp ? resp.map(block => toBlock(block)) : [])
  }

  public getBlockByNumber(no: number): Promise<Block | null> {
    return this.db
      .collection(MongoEthVM.collections.blocks)
      .findOne({ 'header.number': no })
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
