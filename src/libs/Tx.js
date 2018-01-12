import { common } from '@/libs';
var Tx = /** @class */ (function () {
    function Tx(tx) {
        this.cache = {};
        this.tx = tx;
        this.id = common.Hash(this.tx.hash).toString();
    }
    Tx.prototype.getId = function () {
        return this.id;
    };
    Tx.prototype.getHash = function () {
        if (!this.cache.hash)
            this.cache.hash = common.Hash(this.tx.hash);
        return this.cache.hash;
    };
    Tx.prototype.getTo = function () {
        if (!this.cache.to)
            this.cache.to = common.Address(this.tx.to);
        return this.cache.to;
    };
    Tx.prototype.getFrom = function () {
        if (!this.cache.from)
            this.cache.from = common.Address(this.tx.from);
        return this.cache.from;
    };
    Tx.prototype.getGasUsed = function () {
        if (!this.cache.gasUsed)
            this.cache.gasUsed = common.HexNumber(this.tx.gasUsed);
        return this.cache.gasUsed;
    };
    Tx.prototype.getBlockHash = function () {
        if (!this.cache.blcokHash)
            this.cache.blcokHash = common.Hash(this.tx.blockHash);
        return this.cache.blcokHash;
    };
    Tx.prototype.getBlockNumber = function () {
        if (!this.cache.blockNumber)
            this.cache.blockNumber = common.HexNumber(this.tx.blockNumber);
        return this.cache.blockNumber;
    };
    Tx.prototype.geTransactionIndex = function () {
        if (!this.cache.transactionIndex)
            this.cache.transactionIndex = common.HexNumber(this.tx.transactionIndex);
        return this.cache.transactionIndex;
    };
    Tx.prototype.getFromBalance = function () {
        if (!this.cache.fromBalance)
            this.cache.fromBalance = common.EthValue(this.tx.fromBalance);
        return this.cache.fromBalance;
    };
    Tx.prototype.getToBalance = function () {
        if (!this.cache.ethValue)
            this.cache.ethValue = common.EthValue(this.tx.toBalance);
        return this.cache.ethValue;
    };
    Tx.prototype.getCumulativeGasUsed = function () {
        if (!this.cache.cumulativeGasUsed)
            this.cache.cumulativeGasUsed = common.HexNumber(this.tx.cumulativeGasUsed);
        return this.cache.cumulativeGasUsed;
    };
    Tx.prototype.getContractAddress = function () {
        if (!this.cache.contractAddress)
            this.cache.contractAddress = common.Address(this.tx.contractAddress);
        return this.cache.contractAddress;
    };
    Tx.prototype.getLogsBloom = function () {
        if (!this.cache.logsBloom)
            this.cache.logsBloom = common.Hex(this.tx.logsBloom);
        return this.cache.logsBloom;
    };
    Tx.prototype.getGas = function () {
        if (!this.cache.gas)
            this.cache.gas = common.HexNumber(this.tx.gas);
        return this.cache.gas;
    };
    Tx.prototype.getGasPrice = function () {
        if (!this.cache.gasPrice)
            this.cache.gasPrice = common.EthValue(this.tx.gasPrice);
        return this.cache.gasPrice;
    };
    Tx.prototype.getInput = function () {
        if (!this.cache.input)
            this.cache.input = common.Hex(this.tx.input);
        return this.cache.input;
    };
    Tx.prototype.getNonce = function () {
        if (!this.cache.hexNumber)
            this.cache.hexNumber = common.HexNumber(this.tx.nonce);
        return this.cache.hexNumber;
    };
    Tx.prototype.getValue = function () {
        if (!this.cache.ethValue)
            this.cache.ethValue = common.EthValue(this.tx.value);
        return this.cache.ethValue;
    };
    Tx.prototype.getV = function () {
        if (!this.cache.v)
            this.cache.v = common.Hex(this.tx.v);
        return this.cache.v;
    };
    Tx.prototype.getR = function () {
        if (!this.cache.r)
            this.cache.r = common.Hex(this.tx.r);
        return this.cache.r;
    };
    Tx.prototype.getS = function () {
        if (!this.cache.s)
            this.cache.s = common.Hex(this.tx.s);
        return this.cache.s;
    };
    Tx.prototype.getStatus = function () {
        return this.tx.status;
    };
    Tx.prototype.isPending = function () {
        return this.tx.pending;
    };
    return Tx;
}());
export default Tx;
//# sourceMappingURL=Tx.js.map