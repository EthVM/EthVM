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
interface stateLayout {
	count: number;
	txs: Array<txLayout>;
}
let State: stateLayout = {
	count: 0,
	txs: []
}
export {
	State,
	stateLayout,
	txLayout
}