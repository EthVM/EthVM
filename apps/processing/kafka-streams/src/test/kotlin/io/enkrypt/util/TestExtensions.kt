package io.enkrypt.util

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.kafka.mapping.ObjectMapper
import org.ethereum.core.BlockSummary
import org.ethereum.util.blockchain.StandaloneBlockchain
import java.util.concurrent.TimeUnit

val objectMapper = ObjectMapper()

fun StandaloneBlockchain.createBlockRecord(listener: TestEthereumListener): BlockRecord {

  // reset listener and generate block
  listener.resetBlockSummaries(1)
  this.createBlock()

  // capture block summary and convert to block record
  listener.waitForBlockSummaries(30, TimeUnit.SECONDS)
  val blockSummary = listener.blockSummaries.first()

  return objectMapper.convert(objectMapper, BlockSummary::class.java, BlockRecord.Builder::class.java, blockSummary).build()
}
