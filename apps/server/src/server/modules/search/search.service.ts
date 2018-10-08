import { isValidHash } from '@app/server/core/utils'
import { isValidAddress } from 'ethereumjs-util'
import searchEvent from '../../events/search'
import { CacheRepository } from '../../repositories'
import { Address, AddressRepository } from '../address'
import { Block, BlocksRepository } from '../blocks'
import { Tx, TxsRepository } from '../txs'
import { Search, searchType } from './search.entities'

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
    return new Promise(async (resolve, reject) => {
      const s: Search = { type: searchType.None }
      let hashWth0x = ''

      if (hash.slice(0, 2) === '0x') {
        hashWth0x = hash
      } else {
        hash = hash.replace('0x', '')
      }
      if (isValidAddress(hashWth0x)) {
        this.addressRepository.getAddress(hash).then((address: Address) => {
          s.address = address
          s.type = searchType.Address
          resolve(s)
          if (address == null) {
            resolve(s)
            return
          }
        })
      } else if (isValidHash(hash)) {
        this.blockRepository.getBlock(hash).then((block: any) => {
          if (block == null) {
            this.txsRepository.getTx(hash).then((tx: any) => {
              s.tx = tx
              s.type = searchType.Transaction
              resolve(s)
              return
            })
          }
          s.block = block
          s.type = searchType.Block
          resolve(s)
          return
        })
      }
    })
  }
}
