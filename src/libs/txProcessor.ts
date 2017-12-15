import { Tx } from '@/libs'

let dedup = (pastTxs: Array<Tx>): Array<Tx> => {
	for (let i = 0; i < pastTxs.length; i++) {
		for (let j = 0; j < pastTxs.length; j++) {
			if (i != j && pastTxs[i].getHash() == pastTxs[j].getHash()) pastTxs.splice(j,1)
		}
	}
	return pastTxs
}
let processTxs = (tx: Tx, pastTxs: Array<Tx>): Array<Tx> => {
	pastTxs = dedup(pastTxs)
	pastTxs.unshift(tx)
	return pastTxs
}
export default processTxs