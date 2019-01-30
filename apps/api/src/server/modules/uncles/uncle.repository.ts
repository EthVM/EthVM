import { toUncle } from '@app/server/modules/uncles'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Uncle } from 'ethvm-common'

export interface UnclesRepository {
  getUncle(hash: string): Promise<Uncle | null>
  getUncles(limit: number, page: number): Promise<Uncle[]>
  getTotalNumberOfUncles(): Promise<number>
}

export class MongoUncleRepository extends BaseMongoDbRepository implements UnclesRepository {
  public getUncle(hash: string): Promise<Uncle | null> {
    return this.db
      .collection(MongoEthVM.collections.uncles)
      .findOne({ hash })
      .then(resp => {
        if (!resp) {
          return null
        }
        return toUncle(resp)
      })
  }

  public getUncles(limit: number, page: number): Promise<Uncle[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.uncles)
      .find()
      .sort({ number: -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        const u: Uncle[] = []
        if (!resp) {
          return u
        }
        resp.forEach(uncle => {
          const tu = toUncle(uncle)
          u.unshift(tu)
        })
        return u
      })
  }

  public getTotalNumberOfUncles(): Promise<number> {
    return this.db.collection(MongoEthVM.collections.uncles).estimatedDocumentCount()
  }
}
