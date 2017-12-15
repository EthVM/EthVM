import { txLayout } from '@/typeLayouts'
export default interface blockLayout {
	id: string;
	number: string;
	intNumber: number;
	hash: string,
	parentHash: string;
	nonce: string;
	mixHash: string;
	sha3Uncles: string;
	logsBloom: string;
	stateRoot: string;
	miner: string;
	minerBalance: string;
	difficulty: string;
	totalDifficulty: string;
	extraData: string;
	size: string;
	gasLimit: string;
	gasUsed: string;
	timestamp: string;
	transactionsRoot: string;
	receiptsRoot: string;
	transactions: Array<txLayout>;
	uncles: Array<string>;
	isUncle: boolean;
	txFees: string;
	blockReward: string;
}