import { blockLayout, txLayout } from '@/typeLayouts'
import ethUnits from 'ethereumjs-units'
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
		})
	}
	setTransactions(txs: Array<txLayout>): void {
		this.block.transactions = txs
	}
	setIsUncle(isUncle: boolean): void {
		if (isUncle) {
			this.setTransactions([])
			this.setUncles([])
			this.setUncleHashes([])
		}
		this.block.isUncle = isUncle
	}
	setUncles(uncles: Array<Block>): void {
		this.block.uncles = uncles
	}
	getUncles(): Array<Block> {
		return this.block.uncles
	}
	addUncle(uncle: Block): void {
		if (!this.block.uncles) this.block.uncles = []
		this.block.uncles.push(uncle)
	}
	getUncleHashes(): Array<string> {
		return this.block.uncleHashes
	}
	setUncleHashes(hashes: Array<string>): void {
		this.block.uncleHashes = hashes
	}
	getHash(): string {
		return this.block.hash
	}
	getIntNumber(): number {
		return this.block.intNumber
	}
	getTransactionCount(): number {
		return this.block.transactionCount ? this.block.transactionCount : this.block.transactions.length
	}
	getTotalBlockReward(): string {
		return this.block.totalBlockReward ? this.block.totalBlockReward : '0x' + new bn(this.block.blockReward).plus(new bn(this.block.txFees)).toString(16)
	}
}
export default Block
