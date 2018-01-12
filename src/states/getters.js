var all = function (state) {
    return state;
};
var getTxs = function (state) {
    return state.txs.items();
};
var getBlocks = function (state) {
    var blocks = [];
    state.blocks.items().forEach(function (block) {
        if (!block.getIsUncle())
            blocks.push(block);
    });
    return blocks;
};
export default {
    all: all,
    getTxs: getTxs,
    getBlocks: getBlocks
};
//# sourceMappingURL=getters.js.map