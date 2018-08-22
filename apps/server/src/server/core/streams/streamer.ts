import { Block } from '@app/server/modules/blocks'
import { Tx } from '@app/server/modules/txs'
import { ListenerFn } from 'eventemitter3'

export const StreamerEvents = {
  newBlock: 'onNewBlock',
  newTx: 'onNewTx',
  newPendingTx: 'onNewPendingTx'
}

export interface Streamer {
  addListener(eventName: string, fn: ListenerFn)
  removeListener(eventName: string, fn?: ListenerFn)

  onNewBlock(block: Block)
  onNewTxs(txs: Tx[])
  onNewPendingTx(tx: Tx)
}
