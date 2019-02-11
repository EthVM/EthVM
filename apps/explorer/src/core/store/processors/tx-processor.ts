import { Tx } from '@app/core/models'

const dedup = (tx: Tx, pastTxs: Tx[]): Tx[] => {
  for (let i = 0; i < pastTxs.length; i++) {
    if (tx.getId() === pastTxs[i].getId()) {
      pastTxs.splice(i, 1)
    }
  }
  return pastTxs
}

export const processTxs = (tx: Tx, pastTxs: Tx[]): Tx[] => {
  const txs = dedup(tx, pastTxs)
  txs.push(tx)
  return txs
}
