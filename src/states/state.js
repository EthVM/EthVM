import { FIFO, processBlocks, processTxs } from '@/libs';
import globConfigs from '@/configs/global.json';
var State = {
    txs: new FIFO(globConfigs.maxTxsInMemory, processTxs),
    blocks: new FIFO(globConfigs.maxBlocksInMemory, processBlocks)
};
export default State;
//# sourceMappingURL=state.js.map