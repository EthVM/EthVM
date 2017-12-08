import { txLayout, blockLayout } from '@/typeLayouts'

export default interface stateLayout {
	txs: Array<txLayout>;
	blocks: Array<blockLayout>;
}