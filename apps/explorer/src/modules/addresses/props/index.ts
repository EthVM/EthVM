import { PendingTx, SimpleTx, EthValue, SimpleBlock, Transfer } from '@app/core/models'

export class AccountInfo {
  public balance: EthValue = new EthValue(0)
  public exchangeRate: any = { USD: 0 }

  public isMiner: boolean = false
  public minedBlocks: SimpleBlock[] = []
  public totalMinedBlocks: number = 0

  public txs: SimpleTx[] = []
  public totalTxs: number = 0
  public toTxCount: number = 0
  public fromTxCount: number = 0
  public txsFilter = 'all'

  public pendingTxs: PendingTx[] = []
  public totalpendingTxs: number = 0
  public pendingTxsFilter = 'all'

  public tokens: any[] = []
  public tokensOwned: number = 0

  public contracts: any[] = []
  public isCreator: boolean = false

  public type: string = ''

  public internalTransfers: Transfer[] = []
  public totalInternalTransfers: number = 0

  constructor(public readonly address: string) {}
}
