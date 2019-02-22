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
    // Issues to solve:
    //   1) We need to store the count of uncles in processing
    //   2) With that we can proceed with the same process as we're doing with Blocks
    // For now we are resorting to the well known skip, limit calls (but it will cause issues if you go very far)

    const offset = fromUncle !== -1 ? fromUncle : await this.getLatestUncleBlockNumber()
    const skip = page * limit
    return this.db
      .collection(MongoEthVM.collections.uncles)
      .find({ number: {$lte: offset} })
      .sort({ blockNumber: -1, number: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
      .then(resp => resp ? resp.map(uncle => toUncle(uncle)) : [])


    // Here I left original implementation:
    // const offset = fromUncle !== -1 ? fromUncle : await this.getLatestUncleBlockNumber()
    // const start = offset - (page * limit)

    // return this.db
    //   .collection(MongoEthVM.collections.uncles)
    //   .find({ number: {$lte: start} })
    //   .sort({ blockNumber: -1, number: -1 })
    //   .limit(limit)
    //   .toArray()
    //   .then(resp => resp ? resp.map(uncle => toUncle(uncle)) : [])
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
