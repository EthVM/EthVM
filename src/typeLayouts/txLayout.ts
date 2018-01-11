export default interface txLayout {
	root: Buffer;
	blockHash: Buffer;
	blockNumber: Buffer;
	transactionIndex: Buffer;
	from: Buffer;
	fromBalance: Buffer;
	to: Buffer;
	toBalance: Buffer;
	gasUsed: Buffer;
	cumulativeGasUsed: Buffer;
	contractAddress: Buffer;
	logsBloom: Buffer;
	gas: Buffer;
	gasPrice: Buffer;
	hash: Buffer;
	input: Buffer;
	nonce: Buffer;
	value: Buffer;
	v: Buffer;
	r: Buffer;
	s: Buffer;
	status: boolean;
	pending: boolean;
}