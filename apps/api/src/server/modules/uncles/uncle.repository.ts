import { toUncle } from '@app/server/modules/uncles'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Uncle } from 'ethvm-common'

export interface UnclesRepository {
  getUncle(hash: string): Promise<Uncle | null>
  getUncles(limit: number, page: number, fromUncle: number): Promise<Uncle[]>
  getTotalNumberOfUncles(): Promise<number>
}

export class MongoUncleRepository extends BaseMongoDbRepository implements UnclesRepository {
  public getUncle(hash: string): Promise<Uncle | null> {
    return this.db
      .collection(MongoEthVM.collections.uncles)
      .findOne({ hash })
      .then(resp => resp ? toUncle(resp) : null)
  }

  public async getUncles(limit: number, page: number, fromUncle: number = -1): Promise<Uncle[]> {
    const offset = fromUncle !== -1 ? fromUncle : await this.getTotalNumberOfUncles()
    const start = offset - (page * limit)

    return this.db
      .collection(MongoEthVM.collections.uncles)
      .find({ number: {$lt: start} })
      .sort({ blockNumber: -1, number: -1 })
      .limit(limit)
      .toArray()
      .then(resp => resp ? resp.map(uncle => toUncle(uncle)) : [])
  }

  public getTotalNumberOfUncles(): Promise<number> {
    return this.db.collection(MongoEthVM.collections.uncles).estimatedDocumentCount()
  }
}
