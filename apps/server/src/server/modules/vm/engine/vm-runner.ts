import { hexToBuffer } from '@app/server/core/utils'
import { TrieDB } from '@app/server/modules/vm'
import * as VM from '@enkrypt.io/ethereumjs-vm'
import * as Account from 'ethereumjs-account'
import * as LRU from 'lru-cache'
import * as Trie from 'merkle-patricia-tree/secure'

interface Tx {
  to: string
  data: string
}

export class VmRunner {
  private readonly codeCache: LRU.Cache<string, any>
  private stateTrie: Trie

  constructor(private readonly db: TrieDB, private readonly gasLimit: string) {
    this.codeCache = new LRU(2000)
  }

  public setStateRoot(hash: Buffer) {
    this.stateTrie = new Trie(this.db, hash)
  }

  public getCurrentStateRoot(): Promise<Buffer> {
    return new Promise(resolve => resolve(this.stateTrie.root))
  }

  public call(txs: Tx[]): Promise<any> {
    return new Promise(resolve => {
      const runOnVM = (trie: Trie, to: Buffer, code: Buffer, gasLimit: string, data: Buffer): Promise<any> => {
        return new Promise((res, rej) => {
          const vm = new VM({
            state: trie
          })

          vm.runCode(
            {
              address: to,
              code,
              gasLimit,
              data
            },
            (err: Error, result: any) => {
              if (err) {
                rej(err)
                return
              }

              res(result.return)
            }
          )
        })
      }

      const getResult = (tx: Tx, trie: Trie): Promise<any> => {
        if (this.codeCache.peek(tx.to)) {
          const to = hexToBuffer(tx.to)
          const code = this.codeCache.get(tx.to)
          const data = hexToBuffer(tx.data)
          return runOnVM(trie, to, code, this.gasLimit, data)
        }

        return new Promise((res, rej) => {
          trie.get(hexToBuffer(tx.to), (err: Error, val: Buffer) => {
            if (err) {
              rej(err)
              return
            }

            const account = new Account(val)
            trie.getRaw(account.codeHash, (e: Error, code?: Buffer) => {
              if (e) {
                rej(e)
                return
              }

              // Store code in memory to avoid heavy computations
              this.codeCache.set(tx.to, code)

              const to = hexToBuffer(tx.to)
              code = code ? code : new Buffer('00', 'hex')
              const data = hexToBuffer(tx.data)
              runOnVM(trie, to, code, this.gasLimit, data)
                .then(r => res(r))
                .catch(er => rej(er))
            })
          })
        })
      }

      const promises: Array<Promise<any>> = []
      txs.forEach(tx => {
        const trie = this.stateTrie.copy()
        promises.push(getResult(tx, trie).catch(err => err))
      })

      Promise.all(promises).then(res => resolve(res))
    })
  }

  public getAccount(to: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const trie = this.stateTrie.copy()
      const buffer = hexToBuffer(to)

      trie.get(buffer, (err: Error, b: Buffer) => {
        if (err) {
          reject(err)
          return
        }

        resolve(b)
      })
    })
  }
}
