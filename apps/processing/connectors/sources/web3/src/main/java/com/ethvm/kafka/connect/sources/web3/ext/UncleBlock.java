package com.ethvm.kafka.connect.sources.web3.ext;

import java.io.IOException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import org.web3j.protocol.ObjectMapperFactory;
import org.web3j.protocol.core.Response;
import org.web3j.protocol.core.methods.response.Transaction;
import org.web3j.utils.Numeric;

/**
 * Block object returned by:
 * <ul>
 * <li>eth_getBlockByHash</li>
 * <li>eth_getBlockByNumber</li>
 * <li>eth_getUncleByBlockHashAndIndex</li>
 * <li>eth_getUncleByBlockNumberAndIndex</li>
 * </ul>
 *
 * <p>See
 * <a href="https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionbyhash">docs</a>
 * for further details.</p>
 *
 * <p>See the following <a href="https://github.com/ethcore/parity/issues/2401">issue</a> for
 * details on additional Parity fields present in EthBlock.</p>
 */
public class UncleBlock extends Response<UncleBlock.Block> {

  @Override
  @JsonDeserialize(using = UncleBlock.ResponseDeserialiser.class)
  public void setResult(Block result) {
    super.setResult(result);
  }

  public Block getBlock() {
    return getResult();
  }

  public static class Block {
    private String number;
    private String nephewNumber;
    private String nephewHash;
    private int uncleIndex;
    private String hash;
    private String parentHash;
    private String nonce;
    private String sha3Uncles;
    private String logsBloom;
    private String transactionsRoot;
    private String stateRoot;
    private String receiptsRoot;
    private String author;
    private String miner;
    private String mixHash;
    private String difficulty;
    private String totalDifficulty;
    private String extraData;
    private String size;
    private String gasLimit;
    private String gasUsed;
    private String timestamp;
    private List<TransactionResult> transactions;
    private List<String> uncles;
    private List<String> sealFields;

    public Block() {
    }

    public Block(String number, String nephewNumber, String nephewHash, int uncleIndex, String hash, String parentHash, String nonce,
                 String sha3Uncles, String logsBloom, String transactionsRoot,
                 String stateRoot, String receiptsRoot, String author, String miner,
                 String mixHash, String difficulty, String totalDifficulty, String extraData,
                 String size, String gasLimit, String gasUsed, String timestamp,
                 List<TransactionResult> transactions, List<String> uncles,
                 List<String> sealFields) {
      this.number = number;
      this.nephewNumber = nephewNumber;
      this.nephewHash = nephewHash;
      this.uncleIndex = uncleIndex;
      this.hash = hash;
      this.parentHash = parentHash;
      this.nonce = nonce;
      this.sha3Uncles = sha3Uncles;
      this.logsBloom = logsBloom;
      this.transactionsRoot = transactionsRoot;
      this.stateRoot = stateRoot;
      this.receiptsRoot = receiptsRoot;
      this.author = author;
      this.miner = miner;
      this.mixHash = mixHash;
      this.difficulty = difficulty;
      this.totalDifficulty = totalDifficulty;
      this.extraData = extraData;
      this.size = size;
      this.gasLimit = gasLimit;
      this.gasUsed = gasUsed;
      this.timestamp = timestamp;
      this.transactions = transactions;
      this.uncles = uncles;
      this.sealFields = sealFields;
    }

    public BigInteger getNumber() {
      return Numeric.decodeQuantity(number);
    }

    public String getNumberRaw() {
      return number;
    }

    public BigInteger getNephewNumber() {
      return Numeric.decodeQuantity(nephewNumber);
    }

    public String getNephewNumberRaw() {
      return nephewNumber;
    }

    public void setNumber(String number) {
      this.number = number;
    }

    public void setNephewNumber(String nephewNumber) { this.nephewNumber = nephewNumber; }

    public String getNephewHash() {
      return nephewHash;
    }

    public void setNephewHash(String nephewHash) {
      this.nephewHash = nephewHash;
    }

    public int getUncleIndex() {
      return uncleIndex;
    }

    public void setUncleIndex(int uncleIndex) {
      this.uncleIndex = uncleIndex;
    }

    public String getHash() {
      return hash;
    }

    public void setHash(String hash) {
      this.hash = hash;
    }

    public String getParentHash() {
      return parentHash;
    }

    public void setParentHash(String parentHash) {
      this.parentHash = parentHash;
    }

    public BigInteger getNonce() {
      return Numeric.decodeQuantity(nonce);
    }

    public String getNonceRaw() {
      return nonce;
    }

    public void setNonce(String nonce) {
      this.nonce = nonce;
    }

    public String getSha3Uncles() {
      return sha3Uncles;
    }

    public void setSha3Uncles(String sha3Uncles) {
      this.sha3Uncles = sha3Uncles;
    }

    public String getLogsBloom() {
      return logsBloom;
    }

    public void setLogsBloom(String logsBloom) {
      this.logsBloom = logsBloom;
    }

    public String getTransactionsRoot() {
      return transactionsRoot;
    }

    public void setTransactionsRoot(String transactionsRoot) {
      this.transactionsRoot = transactionsRoot;
    }

    public String getStateRoot() {
      return stateRoot;
    }

    public void setStateRoot(String stateRoot) {
      this.stateRoot = stateRoot;
    }

    public String getReceiptsRoot() {
      return receiptsRoot;
    }

    public void setReceiptsRoot(String receiptsRoot) {
      this.receiptsRoot = receiptsRoot;
    }

    public String getAuthor() {
      return author;
    }

    public void setAuthor(String author) {
      this.author = author;
    }

    public String getMiner() {
      return miner;
    }

    public void setMiner(String miner) {
      this.miner = miner;
    }

    public String getMixHash() {
      return mixHash;
    }

    public void setMixHash(String mixHash) {
      this.mixHash = mixHash;
    }

    public BigInteger getDifficulty() {
      return Numeric.decodeQuantity(difficulty);
    }

    public String getDifficultyRaw() {
      return difficulty;
    }

    public void setDifficulty(String difficulty) {
      this.difficulty = difficulty;
    }

    public BigInteger getTotalDifficulty() {
      return Numeric.decodeQuantity(totalDifficulty);
    }

    public String getTotalDifficultyRaw() {
      return totalDifficulty;
    }

    public void setTotalDifficulty(String totalDifficulty) {
      this.totalDifficulty = totalDifficulty;
    }

    public String getExtraData() {
      return extraData;
    }

    public void setExtraData(String extraData) {
      this.extraData = extraData;
    }

    public BigInteger getSize() {
      return Numeric.decodeQuantity(size);
    }

    public String getSizeRaw() {
      return size;
    }

    public void setSize(String size) {
      this.size = size;
    }

    public BigInteger getGasLimit() {
      return Numeric.decodeQuantity(gasLimit);
    }

    public String getGasLimitRaw() {
      return gasLimit;
    }

    public void setGasLimit(String gasLimit) {
      this.gasLimit = gasLimit;
    }

    public BigInteger getGasUsed() {
      return Numeric.decodeQuantity(gasUsed);
    }

    public String getGasUsedRaw() {
      return gasUsed;
    }

    public void setGasUsed(String gasUsed) {
      this.gasUsed = gasUsed;
    }

    public BigInteger getTimestamp() {
      return Numeric.decodeQuantity(timestamp);
    }

    public String getTimestampRaw() {
      return timestamp;
    }

    public void setTimestamp(String timestamp) {
      this.timestamp = timestamp;
    }

    public List<TransactionResult> getTransactions() {
      return transactions;
    }

    @JsonDeserialize(using = ResultTransactionDeserialiser.class)
    public void setTransactions(List<TransactionResult> transactions) {
      this.transactions = transactions;
    }

    public List<String> getUncles() {
      return uncles;
    }

    public void setUncles(List<String> uncles) {
      this.uncles = uncles;
    }

    public List<String> getSealFields() {
      return sealFields;
    }

    public void setSealFields(List<String> sealFields) {
      this.sealFields = sealFields;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) return true;
      if (o == null || getClass() != o.getClass()) return false;
      Block block = (Block) o;
      return uncleIndex == block.uncleIndex &&
        Objects.equals(number, block.number) &&
        Objects.equals(nephewNumber, block.nephewNumber) &&
        Objects.equals(nephewHash, block.nephewHash) &&
        Objects.equals(hash, block.hash) &&
        Objects.equals(parentHash, block.parentHash) &&
        Objects.equals(nonce, block.nonce) &&
        Objects.equals(sha3Uncles, block.sha3Uncles) &&
        Objects.equals(logsBloom, block.logsBloom) &&
        Objects.equals(transactionsRoot, block.transactionsRoot) &&
        Objects.equals(stateRoot, block.stateRoot) &&
        Objects.equals(receiptsRoot, block.receiptsRoot) &&
        Objects.equals(author, block.author) &&
        Objects.equals(miner, block.miner) &&
        Objects.equals(mixHash, block.mixHash) &&
        Objects.equals(difficulty, block.difficulty) &&
        Objects.equals(totalDifficulty, block.totalDifficulty) &&
        Objects.equals(extraData, block.extraData) &&
        Objects.equals(size, block.size) &&
        Objects.equals(gasLimit, block.gasLimit) &&
        Objects.equals(gasUsed, block.gasUsed) &&
        Objects.equals(timestamp, block.timestamp) &&
        Objects.equals(transactions, block.transactions) &&
        Objects.equals(uncles, block.uncles) &&
        Objects.equals(sealFields, block.sealFields);
    }

    @Override
    public int hashCode() {
      return Objects.hash(number, nephewNumber, nephewHash, uncleIndex, hash, parentHash, nonce, sha3Uncles, logsBloom, transactionsRoot, stateRoot, receiptsRoot, author, miner, mixHash, difficulty, totalDifficulty, extraData, size, gasLimit, gasUsed, timestamp, transactions, uncles, sealFields);
    }
  }

  public interface TransactionResult<T> {
    T get();
  }

  public static class TransactionHash implements TransactionResult<String> {
    private String value;

    public TransactionHash() {
    }

    public TransactionHash(String value) {
      this.value = value;
    }

    @Override
    public String get() {
      return value;
    }

    public void setValue(String value) {
      this.value = value;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }
      if (!(o instanceof TransactionHash)) {
        return false;
      }

      TransactionHash that = (TransactionHash) o;

      return value != null ? value.equals(that.value) : that.value == null;
    }

    @Override
    public int hashCode() {
      return value != null ? value.hashCode() : 0;
    }
  }

  public static class TransactionObject extends Transaction
    implements TransactionResult<Transaction> {
    public TransactionObject() {
    }

    public TransactionObject(String hash, String nonce, String blockHash, String blockNumber,
                             String transactionIndex, String from, String to, String value,
                             String gasPrice, String gas, String input, String creates,
                             String publicKey, String raw, String r, String s, int v) {
      super(hash, nonce, blockHash, blockNumber, transactionIndex, from, to, value,
        gasPrice, gas, input, creates, publicKey, raw, r, s, v);
    }

    @Override
    public Transaction get() {
      return this;
    }
  }

  public static class ResultTransactionDeserialiser
    extends JsonDeserializer<List<TransactionResult>> {

    private ObjectReader objectReader = ObjectMapperFactory.getObjectReader();

    @Override
    public List<TransactionResult> deserialize(
      JsonParser jsonParser,
      DeserializationContext deserializationContext) throws IOException {

      List<TransactionResult> transactionResults = new ArrayList<>();
      JsonToken nextToken = jsonParser.nextToken();

      if (nextToken == JsonToken.START_OBJECT) {
        Iterator<TransactionObject> transactionObjectIterator =
          objectReader.readValues(jsonParser, TransactionObject.class);
        while (transactionObjectIterator.hasNext()) {
          transactionResults.add(transactionObjectIterator.next());
        }
      } else if (nextToken == JsonToken.VALUE_STRING) {
        jsonParser.getValueAsString();

        Iterator<TransactionHash> transactionHashIterator =
          objectReader.readValues(jsonParser, TransactionHash.class);
        while (transactionHashIterator.hasNext()) {
          transactionResults.add(transactionHashIterator.next());
        }
      }

      return transactionResults;
    }
  }

  public static class ResponseDeserialiser extends JsonDeserializer<Block> {

    private ObjectReader objectReader = ObjectMapperFactory.getObjectReader();

    @Override
    public Block deserialize(
      JsonParser jsonParser,
      DeserializationContext deserializationContext) throws IOException {
      if (jsonParser.getCurrentToken() != JsonToken.VALUE_NULL) {
        return objectReader.readValue(jsonParser, Block.class);
      } else {
        return null;  // null is wrapped by Optional in above getter
      }
    }
  }
}
