import { Tx, Block } from '@/libs';
var SOCKET_CONNECT = function (state, _msg) { };
var NEW_BLOCK = function (state, block) {
    if (Array.isArray(block))
        block.forEach(function (_block) {
            state.blocks.add(new Block(_block));
        });
    else
        state.blocks.add(new Block(block));
};
var NEW_TX = function (state, tx) {
    if (Array.isArray(tx))
        tx.forEach(function (_tx) {
            state.txs.add(new Tx(_tx));
        });
    else
        state.txs.add(new Tx(tx));
};
export default {
    SOCKET_CONNECT: SOCKET_CONNECT,
    NEW_BLOCK: NEW_BLOCK,
    NEW_TX: NEW_TX
};
//# sourceMappingURL=mutations.js.map