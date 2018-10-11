import { isValidHash } from '@app/server/core/utils'
import { AddressRepository } from '@app/server/modules/address'
import { BlocksRepository } from '@app/server/modules/blocks'
import { Search, SearchType } from '@app/server/modules/search'
import { TxsRepository } from '@app/server/modules/txs'
import { CacheRepository } from '@app/server/repositories'
import { isValidAddress } from 'ethereumjs-util'

export interface SearchService {
  search(hash: string): Promise<Search>
}
export class SearchServiceImpl implements SearchService {
  constructor(
    private readonly txsRepository: TxsRepository,
    private readonly addressRepository: AddressRepository,
    private readonly blockRepository: BlocksRepository,
    private readonly cacheRepository: CacheRepository
  ) {}

  public search(hash: string): Promise<Search> {
    let hashWth0x = ''
    return new Promise(async (resolve, reject) => {
      const s: Search = { type: SearchType.None }
      hash.slice(0, 2) === '0x' ? (hashWth0x = hash.replace('0x', '')) : (hashWth0x = '0x' + hash)
      if (isValidAddress(hashWth0x)) {
        const address = await this.addressRepository.getAddress(hash)
        if (address != null) {
          s.address = address
          s.type = SearchType.Address
        }
      } else if (isValidHash(hash)) {
        const block = await this.blockRepository.getBlock(hash)
        if (block != null) {
          s.block = block
          s.type = SearchType.Block
        }
        const tx = await this.txsRepository.getTx(hash)
        if (tx != null) {
          s.tx = tx
          s.type = SearchType.Transaction
        }
      }
      return resolve(s)
    })
  }
}
