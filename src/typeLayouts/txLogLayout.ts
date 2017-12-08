export default interface txLogLayout {
	address: string;
	topics: Array<string>;
	data: string;
	blockNumber: string;
	txHash: string;
	txIndex: number;
	blockHash: string;
	index: number;
	removed: boolean;
}