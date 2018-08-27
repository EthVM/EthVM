import { Block } from '@app/server/modules/blocks'
import { Tx } from '@app/server/modules/txs'
import { ListenerFn } from 'eventemitter3'

export const StreamerEvents = {
  newBlock: 'onNewBlock',
  newTx: 'onNewTx',
  pendingTx: 'onNewPendingTx'
}

export interface Streamer {
  initialize(): Promise<boolean>

  addListener(eventName: string, fn: ListenerFn)
  removeListener(eventName: string, fn?: ListenerFn)

  onNewBlock(block: Block)
  onNewTx(tx: Tx)
  onNewPendingTx(tx: Tx)
}
