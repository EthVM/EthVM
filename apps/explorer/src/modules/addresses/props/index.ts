import { Block, PendingTx, Tx, EthValue } from '@app/core/models'

export class AccountInfo {
  public balance: EthValue = new EthValue(0)
  public exchangeRate?: any = { USD: 0 }

  public blocks: Block[] = []
  public minerBlocks: Block[] = []

  public txs: Tx[] = []
  public totalTxs: number = 0

  public pendingTxs: PendingTx[] = []

  public tokens: any[] = []

  public contracts: any[] = []
  public creator: boolean = false

  public miner: boolean = false

  public type: string

  constructor(public address: string) {}
}
