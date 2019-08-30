package com.ethvm.kafka.connect.sources.web3.ext;

import org.web3j.protocol.parity.methods.response.Trace;
import org.web3j.protocol.parity.methods.response.VMTrace;

import java.util.List;
import java.util.Map;
import java.util.Objects;

public class FullTrace {

  private String output;
  private Map<String, SimpleStateDiff> stateDiff;
  private List<Trace> trace;
  private VMTrace vmTrace;
  private String transactionHash;

  public String getTransactionHash() {
    return transactionHash;
  }

  public void setTransactionHash(String transactionHash) {
    this.transactionHash = transactionHash;
  }

  public String getOutput() {
    return output;
  }

  public void setOutput(String output) {
    this.output = output;
  }

  public Map<String, SimpleStateDiff> getStateDiff() {
    return stateDiff;
  }

  public void setStateDiff(Map<String, SimpleStateDiff> stateDiff) {
    this.stateDiff = stateDiff;
  }

  public List<Trace> getTrace() {
    return trace;
  }

  public void setTrace(List<Trace> trace) {
    this.trace = trace;
  }

  public VMTrace getVmTrace() {
    return vmTrace;
  }

  public void setVmTrace(VMTrace vmTrace) {
    this.vmTrace = vmTrace;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    FullTrace fullTrace = (FullTrace) o;
    return Objects.equals(output, fullTrace.output) &&
      Objects.equals(stateDiff, fullTrace.stateDiff) &&
      Objects.equals(trace, fullTrace.trace) &&
      Objects.equals(vmTrace, fullTrace.vmTrace) &&
      Objects.equals(transactionHash, fullTrace.transactionHash);
  }

  @Override
  public int hashCode() {
    return Objects.hash(output, stateDiff, trace, vmTrace, transactionHash);
  }

  @Override
  public String toString() {
    return "FullTrace{" +
      "output='" + output + '\'' +
      ", stateDiff=" + stateDiff +
      ", trace=" + trace +
      ", vmTrace=" + vmTrace +
      ", transactionHash='" + transactionHash + '\'' +
      '}';
  }
}
