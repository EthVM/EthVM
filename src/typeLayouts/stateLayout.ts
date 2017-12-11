import { txLayout, blockLayout } from '@/typeLayouts'
import { Block } from '@/libs/'

export default interface stateLayout {
	txs: Array<txLayout>;
	blocks: Array<Block>;
}