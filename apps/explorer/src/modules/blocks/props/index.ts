import {SimpleTx, Uncle} from '@app/core/models'

export class BlockInfo {
  public next: number | null = null
  public prev: number | null = null
  public mined: boolean = false
  public txs:  SimpleTx[] = []
  public totalTxs: number = 0
  public uncles: Uncle[] = []
  public timestamp: Date = new Date()

  constructor(public readonly hash: string) {}
}
