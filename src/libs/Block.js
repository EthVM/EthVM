import { common } from '@/libs';
import bn from 'bignumber.js';
var Block = /** @class */ (function () {
    function Block(block) {
        this.cache = {};
        this.block = block;
        this.id = common.Hash(this.block.hash).toString();
    }
    Block.prototype.getId = function () {
        return this.id;
    };
    Block.prototype.setTransactions = function (txs) {
        this.block.transactions = txs;
    };
    Block.prototype.setIsUncle = function (isUncle) {
        if (isUncle) {
            this.setTransactions([]);
            this.setUncles([]);
            this.setUncleHashes([]);
        }
        this.block.isUncle = isUncle;
    };
    Block.prototype.setUncles = function (uncles) {
        this.block.uncles = uncles;
    };
    Block.prototype.addUncle = function (uncle) {
        if (!this.block.uncles)
            this.block.uncles = [];
        this.block.uncles.push(uncle);
    };
    Block.prototype.getIsUncle = function () {
        if (!this.cache.isUncle)
            this.cache.isUncle = this.block.isUncle;
        return this.cache.isUncle;
    };
    Block.prototype.getUncles = function () {
        return this.block.uncles;
    };
    Block.prototype.getUncleHashes = function () {
        return this.block.uncleHashes.map(function (_uncle) {
            return common.Hash(_uncle);
        });
    };
    Block.prototype.setUncleHashes = function (hashes) {
        this.block.uncleHashes = hashes;
    };
    Block.prototype.getHash = function () {
        if (!this.cache.hash)
            this.cache.hash = common.Hash(this.block.hash);
        return this.cache.hash;
    };
    Block.prototype.getIntNumber = function () {
        return this.block.intNumber;
    };
    Block.prototype.getNumber = function () {
        if (!this.cache.number)
            this.cache.number = common.HexNumber(this.block.number);
        return this.cache.number;
    };
    Block.prototype.getTransactionCount = function () {
        return this.block.transactionCount ? this.block.transactionCount : this.block.transactionHashes.length;
    };
    Block.prototype.getTotalBlockReward = function () {
        if (!this.cache.totalBlockReward)
            this.cache.totalBlockReward = this.block.totalBlockReward ? common.EthValue(this.block.totalBlockReward) : common.EthValue(Buffer.from(new bn(common.HexNumber(this.block.blockReward).toString()).plus(new bn(common.HexNumber(this.block.uncleReward).toString())).plus(new bn(common.HexNumber(this.block.txFees).toString())).toString(16), 'hex'));
        return this.cache.totalBlockReward;
    };
    Block.prototype.getParentHash = function () {
        if (!this.cache.parentHash)
            this.cache.parentHash = common.Hash(this.block.parentHash);
        return this.cache.parentHash;
    };
    Block.prototype.getNonce = function () {
        if (!this.cache.nonce)
            this.cache.nonce = common.Hex(this.block.nonce);
        return this.cache.nonce;
    };
    Block.prototype.getMixHash = function () {
        if (!this.cache.mixHash)
            this.cache.mixHash = common.Hash(this.block.mixHash);
        return this.cache.mixHash;
    };
    Block.prototype.getSha3Uncles = function () {
        if (!this.cache.sha3Uncles)
            this.cache.sha3Uncles = common.Hash(this.block.sha3Uncles);
        return this.cache.sha3Uncles;
    };
    Block.prototype.getLogsBloom = function () {
        if (!this.cache.logsBloom)
            this.cache.logsBloom = common.Hex(this.block.logsBloom);
        return this.cache.logsBloom;
    };
    Block.prototype.getStateRoot = function () {
        if (!this.cache.stateRoot)
            this.cache.stateRoot = common.Hash(this.block.stateRoot);
        return this.cache.stateRoot;
    };
    Block.prototype.getMiner = function () {
        if (!this.cache.miner)
            this.cache.miner = common.Address(this.block.miner);
        return this.cache.miner;
    };
    Block.prototype.getMinerBalance = function () {
        if (!this.cache.minerBalance)
            this.cache.minerBalance = common.EthValue(this.block.minerBalance);
        return this.cache.minerBalance;
    };
    Block.prototype.getDifficulty = function () {
        if (!this.cache.difficulty)
            this.cache.difficulty = common.HexNumber(this.block.difficulty);
        return this.cache.difficulty;
    };
    Block.prototype.getTotalDifficulty = function () {
        if (!this.cache.totalDifficulty)
            this.cache.totalDifficulty = common.HexNumber(this.block.totalDifficulty);
        return this.cache.totalDifficulty;
    };
    Block.prototype.getExtraData = function () {
        if (!this.cache.extraData)
            this.cache.extraData = common.Hex(this.block.extraData);
        return this.cache.extraData;
    };
    Block.prototype.getSize = function () {
        if (!this.cache.size)
            this.cache.size = common.HexNumber(this.block.size);
        return this.cache.size;
    };
    Block.prototype.getGasLimit = function () {
        if (!this.cache.gasLimit)
            this.cache.garLimit = common.HexNumber(this.block.gasLimit);
        return this.cache.garLimit;
    };
    Block.prototype.getGasUsed = function () {
        if (!this.cache.gasUsed)
            this.cache.gasUsed = common.HexNumber(this.block.gasUsed);
        return this.cache.gasUsed;
    };
    Block.prototype.getTimestamp = function () {
        if (!this.cache.timestamp)
            this.cache.timestamp = common.HexTime(this.block.timestamp);
        return this.cache.timestamp;
    };
    Block.prototype.getTransactionsRoot = function () {
        if (!this.cache.transactionsRoot)
            this.cache.transactionsRoot = common.Hash(this.block.transactionsRoot);
        return this.cache.transactionsRoot;
    };
    Block.prototype.getReceiptsRoot = function () {
        if (!this.cache.receiptsRoot)
            this.cache.receiptsRoot = common.Hash(this.block.receiptsRoot);
        return this.cache.receiptsRoot;
    };
    Block.prototype.getTransactions = function () {
        return this.block.transactions;
    };
    Block.prototype.geTransactionHashes = function () {
        if (!this.cache.transactionHashes)
            this.cache.transactionHashes = this.block.transactionHashes.map(function (_hash, idx) {
                return common.Hash(_hash);
            });
        return this.cache.transactionHashes;
    };
    Block.prototype.getTxFees = function () {
        if (!this.cache.txFees)
            this.cache.txFees = common.EthValue(this.block.txFees);
        return this.cache.txFees;
    };
    Block.prototype.getBlockReward = function () {
        if (!this.cache.blockReward)
            this.cache.blockReward = common.EthValue(this.block.blockReward);
        return this.cache.blockReward;
    };
    Block.prototype.getUncleReward = function () {
        if (!this.cache.uncleReward)
            this.cache.uncleReward = common.EthValue(this.block.uncleReward);
        return this.cache.uncleReward;
    };
    Block.prototype.getStats = function () {
        return this.block.blockStats;
    };
    return Block;
}());
export default Block;
//# sourceMappingURL=Block.js.map