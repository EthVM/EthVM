package com.ethvm.kafka.connect.sources.web3.ext;

import org.web3j.protocol.core.methods.response.EthBlock;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.parity.methods.response.Trace;

import java.util.List;
import java.util.Objects;

public class FullBlock {

  private EthBlock.Block block;
  private List<EthBlock.Block> uncles;
  private List<TransactionReceipt> receipts;
  private List<Trace> traces;

  public FullBlock() {
  }

  public FullBlock(EthBlock.Block block, List<EthBlock.Block> uncles, List<TransactionReceipt> receipts, List<Trace> traces) {
    this.block = block;
    this.uncles = uncles;
    this.receipts = receipts;
    this.traces = traces;
  }

  public EthBlock.Block getBlock() {
    return block;
  }

  public void setBlock(EthBlock.Block block) {
    this.block = block;
  }

  public List<EthBlock.Block> getUncles() {
    return uncles;
  }

  public void setUncles(List<EthBlock.Block> uncles) {
    this.uncles = uncles;
  }

  public List<TransactionReceipt> getReceipts() {
    return receipts;
  }

  public void setReceipts(List<TransactionReceipt> receipts) {
    this.receipts = receipts;
  }

  public List<Trace> getTraces() {
    return traces;
  }

  public void setTraces(List<Trace> traces) {
    this.traces = traces;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    FullBlock fullBlock = (FullBlock) o;
    return Objects.equals(block, fullBlock.block) &&
      Objects.equals(uncles, fullBlock.uncles) &&
      Objects.equals(receipts, fullBlock.receipts) &&
      Objects.equals(traces, fullBlock.traces);
  }

  @Override
  public int hashCode() {
    return Objects.hash(block, uncles, receipts, traces);
  }

  @Override
  public String toString() {
    return "FullBlock{" +
      "block=" + block +
      ", uncles=" + uncles +
      ", receipts=" + receipts +
      ", traces=" + traces +
      '}';
  }
}
