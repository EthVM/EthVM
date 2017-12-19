import { txLayout, traceLayout } from '@/typeLayouts'
import ethUnits from 'ethereumjs-units'
import bn from 'bignumber.js'
import _ from 'lodash'
class Tx {
	private readonly tx: txLayout
	public readonly type: string
	constructor(tx: txLayout) {
		this.tx = tx
		let parent = this
		Object.keys(parent.tx).forEach((key, idx) => {
			parent[_.camelCase('get ' + key)] = () => {
				return parent.tx[key]
			}
		})
	}
	getHash(): string {
		return this.tx.hash
	}
	getTrace(): traceLayout {
		return this.tx.trace
	}
}
export default Tx
