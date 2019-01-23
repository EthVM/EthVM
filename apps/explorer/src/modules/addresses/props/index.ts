import { Block, PendingTx, Tx, EthValue } from '@app/core/models'

export class AccountInfo {
  public balance: EthValue = new EthValue(0)
  public exchangeRate?: any = { USD: 0 }

  public blocks: Block[] = []
  public minedBlocks: Block[] = []

  public txs: Tx[] = []
  public totalTxs: number = 0

  public intTxs: Tx[] = []
  public totalInTxs: number = 0

  public outTxs: Tx[] = []
  public totalOutTxs: number = 0

  public pendingTxs: PendingTx[] = []
  public totalpendingTxs: number = 0

  public tokens: any[] = []

  public contracts: any[] = []
  public creator: boolean = false

  public isMiner: boolean = false

  public type: string

  constructor(public readonly address: string) {}
}
