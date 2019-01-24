import { toTokenTransfer } from '@app/server/modules/tokens'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { TokenTransfer } from 'ethvm-common'

export interface TokensRepository {
  getAddressTokenTransfers(address: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]>
}

export class MongoTokensRepository extends BaseMongoDbRepository implements TokensRepository {
  public getAddressTokenTransfers(address: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]> {
    const start = page * limit
    let find
    switch (filter) {
      case 'in':
        find = { transferType: { $not: { $eq: 'ETHER' } }, from: address }
        break
      case 'out':
        find = { transferType: { $not: { $eq: 'ETHER' } }, to: address }
        break
      default:
        find = { transferType: { $not: { $eq: 'ETHER' } }, $or: [{ from: address }, { to: address }] }
        break
    }
    return this.db
      .collection(MongoEthVM.collections.tokenTransfers)
      .find(find)
      .sort({ timestamp: -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        const t: TokenTransfer[] = []
        if (!resp) {
          return t
        }
        resp.forEach(tx => t.unshift(toTokenTransfer(tx)))
        return t
      })
  }
}
