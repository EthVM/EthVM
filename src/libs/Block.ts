
import { blockLayout, txLayout } from '@/typeLayouts'
import { common, Tx } from '@/libs'
import { Hash, EthValue, HexNumber, Address, Hex, HexTime } from '@/libs/common'
import ethUnits from 'ethereumjs-units'
import bn from 'bignumber.js'
import _ from 'lodash'
class Block {
	private readonly block: blockLayout
	public readonly type: string
	constructor(block: blockLayout) {
		this.block = block
		this.block.uncleHashes = this.block.uncleHashes.map((_uncle) => {
			return common.Hash(_uncle)
		})
	}
	setTransactions(txs: Array<Tx>): void {
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
	addUncle(uncle: Block): void {
		if (!this.block.uncles) this.block.uncles = []
		this.block.uncles.push(uncle)
	}
	getIsUncle(): boolean {
		return this.block.isUncle
	}
	getUncles(): Array<Block> {
		return this.block.uncles
	}
	getUncleHashes(): Array<Hash> {
		return this.block.uncleHashes
	}
	setUncleHashes(hashes: Array<Hash>): void {
		this.block.uncleHashes = hashes
	}
	getHash(): Hash {
		return common.Hash(this.block.hash)
	}
	getIntNumber(): number {
		return this.block.intNumber
	}
	getNumber(): HexNumber {
		return common.HexNumber(this.block.number)
	}
	getTransactionCount(): number {
		return this.block.transactionCount ? this.block.transactionCount : this.block.transactionHashes.length
	}
	getTotalBlockReward(): EthValue {
		return this.block.totalBlockReward ? common.EthValue(this.block.totalBlockReward) : common.EthValue(Buffer.from(new bn(common.HexNumber(this.block.blockReward).toString()).plus(new bn(common.HexNumber(this.block.txFees).toString())).toString(16), 'hex'))
	}
	getParentHash(): Hash {
		return common.Hash(this.block.parentHash)
	}
	getNonce(): Hex {
		return common.Hex(this.block.nonce)
	}
	getMixHash(): Hash {
		return common.Hash(this.block.mixHash)
	}
	getSha3Uncles(): Hash {
		return common.Hash(this.block.sha3Uncles)
	}
	getLogsBloom(): Hex {
		return common.Hex(this.block.logsBloom)
	}

	getStateRoot(): Hash {
		return common.Hash(this.block.stateRoot)
	}
	getMiner(): Address {
		return common.Address(this.block.miner)

	}
	getMinerBalance(): EthValue {
		return common.EthValue(this.block.minerBalance)

	}
	getDifficulty(): HexNumber {
		return common.HexNumber(this.block.difficulty)
	}

	getTotalDifficulty(): HexNumber {
		return common.HexNumber(this.block.totalDifficulty)
	}
	getExtraData(): Hex {
		return common.Hex(this.block.extraData)
	}
	getSize(): HexNumber {
		return common.HexNumber(this.block.size)
	}
	getGasLimit(): HexNumber {
		return common.HexNumber(this.block.gasLimit)
	}
	getGasUsed(): HexNumber {
		return common.HexNumber(this.block.gasUsed)
	}
	getTimestamp(): HexTime {
		return common.HexTime(this.block.timestamp)
	}
	getTransactionsRoot(): Hash {
		return common.Hash(this.block.transactionsRoot)
	}
	getReceiptsRoot(): Hash {
		return common.Hash(this.block.receiptsRoot)
	}
	getTransactions(): Array<Tx> {
		return this.block.transactions
	}
	geTransactionHashes(): Array<Hash> {
		return this.block.transactionHashes.map((_hash, idx) => {
			return common.Hash(_hash)
		})
	}
	getTxFees(): EthValue {
		return common.EthValue(this.block.txFees)
	}
	getBlockReward(): EthValue {
		return common.EthValue(this.block.blockReward)
	}
}
export default Block
