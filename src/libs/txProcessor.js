var dedup = function (tx, pastTxs) {
    for (var i = 0; i < pastTxs.length; i++) {
        if (tx.getId() == pastTxs[i].getId())
            pastTxs.splice(i, 1);
    }
    return pastTxs;
};
var processTxs = function (tx, pastTxs) {
    pastTxs = dedup(tx, pastTxs);
    pastTxs.unshift(tx);
    return pastTxs;
};
export default processTxs;
//# sourceMappingURL=txProcessor.js.map