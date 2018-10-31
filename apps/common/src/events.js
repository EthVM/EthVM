"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = {
    join: "join",
    leave: "leave",
    newTx: "NEW_TX",
    newPendingTx: "NEW_PENDING_TX",
    newBlock: "NEW_BLOCK",
    pastTxs: "pastTxs",
    pastTxsR: "PAST_TXS_RECEIVED",
    pastBlocks: "pastBlocks",
    getBalance: "getBalance",
    getTokenBalance: "getTokenBalance",
    getTotalTxs: "getTotalTxs",
    getTicker: "getTicker",
    getTxs: "getTxs",
    getTx: "getTx",
    getBlock: "getBlock",
    getBlockTransactions: "getBlockTransactions",
    getAddress: "getAddress",
    pendingTxs: "pendingTxs",
    pendingTxsAddress: "getPendingTxs",
    getUncle: "uncle",
    getUncles: "uncles",
    newUncle: "NEW_UNCLE",
    ethCall: "eth-call",
    pastBlocksR: "PAST_BLOCKS_RECEIVED"
};
// interface Events {
// 	readonly link: string
// 	readonly byLine: string
// }
// export const events: Events = {
// 	link: '#502012',
// 	byLine: 'grey'
// }
