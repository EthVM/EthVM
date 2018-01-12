import { Block, Tx } from '@/libs';
import defaultRooms from '@/configs/defaultRooms.json';
import sEvents from '@/configs/socketEvents.json';
var socket_newBlock = function (_a, block) {
    var commit = _a.commit, stateLayout = _a.state;
    commit('NEW_BLOCK', block);
    this._vm.$eventHub.$emit(sEvents.newBlock, Array.isArray(block) ? new Block(block[0]) : new Block(block));
};
var socket_newTx = function (_a, tx) {
    var commit = _a.commit, stateLayout = _a.state;
    commit('NEW_TX', tx);
    this._vm.$eventHub.$emit(sEvents.newTx, Array.isArray(tx) ? new Tx(tx[0]) : new Tx(tx));
};
var socket_connect = function (_a, tx) {
    var _this = this;
    var commit = _a.commit, stateLayout = _a.state;
    defaultRooms.forEach(function (_room) {
        _this._vm.$socket.emit(sEvents.join, _room);
    });
    this._vm.$socket.emit(sEvents.pastTxs, '', function (_txs) {
        commit('NEW_TX', _txs);
        _this._vm.$eventHub.$emit(sEvents.pastTxsR);
        _this._vm.$eventHub.$emit(sEvents.newTx, new Tx(_txs[0]));
    });
    this._vm.$socket.emit(sEvents.pastBlocks, '', function (_blocks) {
        commit('NEW_BLOCK', _blocks);
        _this._vm.$eventHub.$emit(sEvents.newBlock, new Block(_blocks[0]));
        _this._vm.$eventHub.$emit(sEvents.pastBlocksR);
    });
};
export default {
    socket_newBlock: socket_newBlock,
    socket_newTx: socket_newTx,
    socket_connect: socket_connect
};
//# sourceMappingURL=actions.js.map