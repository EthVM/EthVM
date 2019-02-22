import { toUncle } from '@app/server/modules/uncles'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Uncle } from 'ethvm-common'

export interface UnclesRepository {
  getUncle(hash: string): Promise<Uncle | null>
  getUncles(limit: number, page: number, fromUncle: number): Promise<Uncle[]>
  getTotalNumberOfUncles(): Promise<number>
  getLatestUncleBlockNumber(): Promise<number>
}

export class MongoUncleRepository extends BaseMongoDbRepository implements UnclesRepository {
  public getUncle(hash: string): Promise<Uncle | null> {
    return this.db
      .collection(MongoEthVM.collections.uncles)
      .findOne({ hash })
      .then(resp => resp ? toUncle(resp) : null)
  }

  public async getUncles(limit: number, page: number, fromUncle: number = -1): Promise<Uncle[]> {
    /**
     * Total number of Uncles is not necessarily equal the highest block number of uncles in the DB.
     * E.G. getTotalNumberOfUncles returns 10879, but the number of the first entry I see
     * in the DB is number: 105019 blockNumber: 105021. Highest is 127405.
     */  
    const offset = fromUncle !== -1 ? fromUncle : await this.getLatestUncleBlockNumber() 
    // const offset = fromUncle !== -1 ? fromUncle : await this.getTotalNumberOfUncles()    
    const skip = page * limit
    // const start = offset - (page * limit)

    return this.db
      .collection(MongoEthVM.collections.uncles)
      // .find({ number: {$lte: start} })
      .find({ number: {$lte: offset} })
      .sort({ blockNumber: -1, number: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
      .then(resp => resp ? resp.map(uncle => toUncle(uncle)) : [])
  }

  public getTotalNumberOfUncles(): Promise<number> {
    return this.db.collection(MongoEthVM.collections.uncles).estimatedDocumentCount()
  }

  /**
   * Should still be pretty efficient. From Mongo Docs:
   * 
   * When a $sort immediately precedes a $limit, the optimizer can coalesce the $limit into the $sort. 
   * This allows the sort operation to only maintain the top n results as it progresses, 
   * where n is the specified limit, and MongoDB only needs to store n items in memory.
   */
  public async getLatestUncleBlockNumber(): Promise<number> {
    let result = await this.db
      .collection(MongoEthVM.collections.uncles)
      .find()
      .sort({ blockNumber: -1, number: -1 })
      .limit(1)
      .toArray()
    return result ? parseInt(result[0].blockNumber) : 0
  }
}
