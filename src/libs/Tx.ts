import { txLayout } from '@/typeLayouts'
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
			parent[_.camelCase('get ' + key)].toBuffer = (): Buffer => {
				return Buffer.from(parent.tx[key].toLowerCase().replace('0x', ''), 'hex')
			}
			parent[_.camelCase('get ' + key)].toEth = (): number => {
				return ethUnits.convert(new bn(parent.tx[key]).toString(), 'wei', 'eth')
			}
			parent[_.camelCase('get ' + key)].toNumber = (): bn => {
				return new bn(parent.tx[key])
			}
		})
	}
}
export default Tx
