import { Tx } from '@/libs'

const dedup = (tx: Tx, pastTxs: Tx[]): Tx[] => {
  for (let i = 0; i < pastTxs.length; i++) {
    if (tx.getId() === pastTxs[i].getId()) {
      pastTxs.splice(i, 1)
    }
  }
  return pastTxs
}

const processTxs = (tx: Tx, pastTxs: Tx[]): Tx[] => {
  pastTxs = dedup(tx, pastTxs)
  pastTxs.unshift(tx)
  return pastTxs
}

export default processTxs
