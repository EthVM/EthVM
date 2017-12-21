import { txLayout } from '@/typeLayouts'
import { Block, Tx } from '@/libs'
import { Hash } from '@/libs/common'
export default interface blockLayout {
	number: Buffer;
	intNumber: number;
	hash: Buffer,
	parentHash: Buffer;
	nonce: Buffer;
	mixHash: Buffer;
	sha3Uncles: Buffer;
	logsBloom: Buffer;
	stateRoot: Buffer;
	miner: Buffer;
	minerBalance: Buffer;
	difficulty: Buffer;
	totalDifficulty: Buffer;
	extraData: Buffer;
	size: Buffer;
	gasLimit: Buffer;
	gasUsed: Buffer;
	timestamp: Buffer;
	transactionsRoot: Buffer;
	receiptsRoot: Buffer;
	transactions: Array<Tx>;
	transactionHashes: Array<Buffer>
	transactionCount: number;
	uncleHashes: Array<Hash>;
	uncles: Array<Block>;
	isUncle: boolean;
	txFees: Buffer;
	blockReward: Buffer;
	totalBlockReward: Buffer;
}