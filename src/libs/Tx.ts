import { txLayout, traceLayout } from '@/typeLayouts'
import { common } from '@/libs'
import { Hash, Address, HexNumber, Hex, EthValue} from '@/libs/common'
import ethUnits from 'ethereumjs-units'
import bn from 'bignumber.js'
import _ from 'lodash'
class Tx {
	private readonly tx: txLayout
	public readonly id: string

	constructor(tx: txLayout) {
		this.tx = tx
		this.id = common.Hash(this.tx.hash).toString()
	}
	getId(): string {
		return this.id
	}
	getHash(): Hash {
		return common.Hash(this.tx.hash)
	}
	getTo(): Address {
		return common.Address(this.tx.to)
	}
	getFrom(): Address {
		return common.Address(this.tx.from)
	}
	getGasUsed(): HexNumber {
		return common.HexNumber(this.tx.gasUsed)
	}
	getBlockHash(): Hash {
		return common.Hash(this.tx.blockHash)
	}
	getBlockNumber(): HexNumber {
		return common.HexNumber(this.tx.blockNumber)
	}
	geTransactionIndex(): HexNumber {
		return common.HexNumber(this.tx.transactionIndex)
	}
	getFromBalance(): EthValue {
		return common.EthValue(this.tx.fromBalance)
	}
	getToBalance(): EthValue {
		return common.EthValue(this.tx.toBalance)
	}

	getCumulativeGasUsed(): HexNumber {
		return common.HexNumber(this.tx.cumulativeGasUsed)
	}
	getContractAddress(): Address {
		return common.Address(this.tx.contractAddress)
	}
	getLogsBloom(): Hex {
		return common.Hex(this.tx.logsBloom)
	}
	getGas(): HexNumber {
		return common.HexNumber(this.tx.gas)
	}
	getGasPrice(): EthValue {
		return common.EthValue(this.tx.gasPrice)
	}

	getInput(): Hex {
		return common.Hex(this.tx.input)

	}
	getNonce(): HexNumber {
		return common.HexNumber(this.tx.nonce)
	}
	getValue(): EthValue {
		return common.EthValue(this.tx.value)
	}
	getV(): Hex {
		return common.Hex(this.tx.v)
	}
	getR(): Hex {
		return common.Hex(this.tx.r)
	}
	getS(): Hex {
		return common.Hex(this.tx.s)
	}
	getSatus(): boolean {
		return this.tx.status
	}
}
export default Tx