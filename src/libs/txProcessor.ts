import { Tx } from '@/libs'

let dedup = (tx:Tx, pastTxs: Array<Tx>): Array<Tx> => {
	for (let i = 0; i < pastTxs.length; i++) {
		if (tx.getId() == pastTxs[i].getId()) pastTxs.splice(i, 1)
	}
	return pastTxs
}
let processTxs = (tx: Tx, pastTxs: Array<Tx>): Array<Tx> => {
	pastTxs = dedup(tx, pastTxs)
	pastTxs.unshift(tx)
	return pastTxs
}
export default processTxs