import { Tx, FIFO } from '@/libs'

let dedup = (pastTxs: FIFO<Tx>): FIFO<Tx> => {
	let items = pastTxs.items()
	for (let i = 0; i < items.length; i++) {
		for (let j = 0; j < items.length; j++) {
			if (i != j && items[i].getHash() == items[j].getHash()) pastTxs.remove(j);
		}
	}
	return pastTxs
}
let processTxs = (tx: Tx, pastTxs: FIFO<Tx>): FIFO<Tx> => {
	pastTxs = dedup(pastTxs)
	return pastTxs
}
export default processTxs