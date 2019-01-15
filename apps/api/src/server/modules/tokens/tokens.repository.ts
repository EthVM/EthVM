import { toTokenTransfer } from '@app/server/modules/tokens'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { TokenTransfer } from 'ethvm-common'

export interface TokensRepository {
  getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]>
}

export class MongoTokensRepository extends BaseMongoDbRepository implements TokensRepository {
  public getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.tokenTransfers)
      .find({ transferType: { $not: { $eq: 'ETHER' } }, $or: [{ from: address }, { to: address }] })
      .sort({ timestamp: -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        const t: TokenTransfer[] = []
        if (!resp) {
          return t
        }
        resp.forEach(tx => {
          t.push(toTokenTransfer(tx))
        })
        return t
      })
  }
}
