var setUncles = function (block, hash, blocks) {
    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].getHash().toString() == hash) {
            blocks[i].setIsUncle(true);
            block.addUncle(blocks[i]);
            blocks.splice(i, 1);
        }
    }
    return blocks;
};
var setUnclesToUnclesAndAdd = function (block, pastBlocks) {
    var uncleHashes = block.getUncleHashes();
    for (var i = 0; i < uncleHashes.length; i++) {
        pastBlocks = setUncles(block, uncleHashes[i].toString(), pastBlocks);
    }
    pastBlocks.unshift(block);
    return pastBlocks;
};
var dedup = function (block, pastBlocks) {
    for (var i = 0; i < pastBlocks.length; i++) {
        if (block.getId() == pastBlocks[i].getId())
            pastBlocks.splice(i, 1);
    }
    return pastBlocks;
};
var processBlocks = function (block, pastBlocks) {
    pastBlocks = dedup(block, pastBlocks);
    pastBlocks = setUnclesToUnclesAndAdd(block, pastBlocks);
    pastBlocks.sort(function (a, b) { return b.getIntNumber() - a.getIntNumber(); });
    return pastBlocks;
};
export default processBlocks;
//# sourceMappingURL=blockProcessor.js.map