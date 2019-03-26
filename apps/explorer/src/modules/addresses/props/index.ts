import {PendingTx, SimpleTx, EthValue, SimpleBlock } from '@app/core/models'

export class AccountInfo {
  public balance: EthValue = new EthValue(0)
  public exchangeRate: any = { USD: 0 }

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
  public isMiner: boolean = false

  public type: string = ''

  constructor(public readonly address: string) {}
}
