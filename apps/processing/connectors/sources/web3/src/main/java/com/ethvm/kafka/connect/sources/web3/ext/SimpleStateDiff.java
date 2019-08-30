package com.ethvm.kafka.connect.sources.web3.ext;

import com.fasterxml.jackson.databind.JsonNode;
import org.web3j.protocol.parity.methods.response.StateDiff;

import java.util.Map;

public class SimpleStateDiff extends StateDiff {

  @Override
  public void setStorage(Map<String, JsonNode> storage) {
    // Do nothing, there is a parse issue to be resolved but we don't use it anyway
  }

}
