import { toBalance } from '@app/server/modules/balances'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { AddressBalance } from 'ethvm-common'

export interface BalancesRepository {
  getAccount(hash: string): Promise<AddressBalance | null>
}

export class MongoBalancesRepository extends BaseMongoDbRepository implements BalancesRepository {
  public getAccount(hash: string): Promise<AddressBalance | null> {
    return this.db
      .collection(MongoEthVM.collections.balances)
      .findOne({ _id: hash })
      .then(resp => {
        if (!resp) {
          return null
        }
        return toBalance(resp)
      })
  }
}
