import { SimpleTx, Uncle } from '@app/core/models'
import BigNumber from 'bignumber.js'

export class BlockInfo {
  public next: BigNumber | null = null
  public prev: BigNumber | null = null
  public mined: boolean = false
  public txs: SimpleTx[] = []
  public totalTxs: number = 0
  public uncles: Uncle[] = []
  public timestamp: Date = new Date()

  constructor(public readonly block: string) {}
}
