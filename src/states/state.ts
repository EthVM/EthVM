import Vue from 'vue'

interface txLayout {
	hash: string;
	block: number;
	age: number;
	from: string;
	to: string;
	value: number;
	fee: number;
}

interface blockLayout {
	height: number;
	age: number;
	numTransactions: number;
	miner: string;
	gasLimit: number;
	rewards: number;
	gasUsed: number;
	hash: string;
}

interface stateLayout {
	count: number;
	txs: Array<txLayout>;
	blocks: Array<blockLayout>;
}
let State: stateLayout = {
	count: 0,
	txs: [],
	blocks:[]
}
export {
	State,
	stateLayout,
	txLayout,
	blockLayout
}