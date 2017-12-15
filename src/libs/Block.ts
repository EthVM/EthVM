import { blockLayout, txLayout } from '@/typeLayouts'
import ethUnits  from 'ethereumjs-units'
import bn from 'bignumber.js'
import _ from 'lodash'
class Block {
	private readonly block: blockLayout
	public readonly type: string
	constructor(block: blockLayout) {
		this.block = block
		let parent = this
		Object.keys(parent.block).forEach((key, idx) => {
			parent[_.camelCase('get ' + key)] = () => {
				return parent.block[key]
			}
			parent[_.camelCase('get ' + key)].toBuffer = (): Buffer => {
				return Buffer.from(parent.block[key].toLowerCase().replace('0x', ''), 'hex')
			}
			parent[_.camelCase('get ' + key)].toEth = (): number => {
				return ethUnits.convert(new bn(parent.block[key]).toString(), 'wei', 'eth')
			}
			parent[_.camelCase('get ' + key)].toNumber = (): bn => {
				return new bn(parent.block[key])
			}
		})
	}
	setTransactions(txs: Array<txLayout>) {
		this.block.transactions = txs
	}
	setIsUncle(isUncle: boolean) {
		this.block.isUncle = isUncle
	}
	getUncles(): Array<string> {
		return this.block.uncles
	}
	getHash(): string {
		return this.block.hash
	}
	getIntNumber(): number {
		return this.block.intNumber
	}
}
export default Block
