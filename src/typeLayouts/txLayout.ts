import { txLogLayout, traceLayout } from '@/typeLayouts'
export default interface txLayout {
	root: string;
	blockHash: string;
	blockNumber: string;
	transactionIndex: string;
	from: string;
	fromBalance: string;
	to: string;
	toBalance: string;
	gasUsed: string;
	cumulativeGasUsed: string;
	contractAddress: string;
	logs: Array<txLogLayout>;
	logsBloom: string;
	gas: string;
	gasPrice: string;
	hash: string;
	input: string;
	nonce: string;
	value: string;
	v: string;
	r: string;
	s: string;
	status: boolean;
	trace: traceLayout;
}