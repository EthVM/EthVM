import { Block, Tx, FIFO } from '@/libs/'

export default interface stateLayout {
	txs: FIFO<Tx>;
	blocks: FIFO<Block>;
}