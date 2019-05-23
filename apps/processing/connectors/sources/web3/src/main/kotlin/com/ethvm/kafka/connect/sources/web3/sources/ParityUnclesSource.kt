package com.ethvm.kafka.connect.sources.web3.sources

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.UncleListRecord
import com.ethvm.avro.capture.UncleRecord
import com.ethvm.common.extensions.getHeightBI
import com.ethvm.common.extensions.setNumberBI
import com.ethvm.kafka.connect.sources.web3.ext.JsonRpc2_0ParityExtended
import com.ethvm.kafka.connect.sources.web3.ext.toUncleRecord
import com.ethvm.kafka.connect.sources.web3.utils.AvroToConnect
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext

class ParityUnclesSource(
  sourceContext: SourceTaskContext,
  parity: JsonRpc2_0ParityExtended,
  private val unclesTopic: String,
  syncStateTopic: String
) : AbstractParityEntitySource(sourceContext, parity, syncStateTopic) {

  override val partitionKey: Map<String, Any> = mapOf("model" to "uncles")

  override fun fetchRange(range: LongRange): List<SourceRecord> {

    val resp = parity
      .ethvmGetUnclesByNumber(
        range.first.toBigInteger(),
        range.endInclusive.toBigInteger()
      ).send()

    val unclesByBlockNumber = resp.uncles
      .map { it.toUncleRecord(UncleRecord.newBuilder()).build() }
      .groupBy { it.getHeightBI() }

    return range.map { blockNumber ->

      val blockNumberBI = blockNumber.toBigInteger()

      val partitionOffset = mapOf("blockNumber" to blockNumber)
      val uncles = unclesByBlockNumber.getOrDefault(blockNumberBI, emptyList())

      val canonicalKeyRecord = CanonicalKeyRecord.newBuilder()
        .setNumberBI(blockNumberBI)
        .build()

      val unclesListRecord = UncleListRecord.newBuilder()
        .setUncles(uncles)
        .build()

      val keySchemaAndValue = AvroToConnect.toConnectData(canonicalKeyRecord)
      val valueSchemaAndValue = AvroToConnect.toConnectData(unclesListRecord)

      SourceRecord(
        partitionKey,
        partitionOffset,
        unclesTopic,
        keySchemaAndValue.schema(),
        keySchemaAndValue.value(),
        valueSchemaAndValue.schema(),
        valueSchemaAndValue.value()
      )
    }

  }

  override fun tombstonesForRange(range: LongRange): List<SourceRecord> =
    range
      .map { blockNumber ->

        val blockNumberBI = blockNumber.toBigInteger()
        val partitionOffset = mapOf("blockNumber" to blockNumber)

        val canonicalKeyRecord = CanonicalKeyRecord.newBuilder()
          .setNumberBI(blockNumberBI)
          .build()

        val canonicalKeySchemaAndValue = AvroToConnect.toConnectData(canonicalKeyRecord)

        SourceRecord(
          partitionKey,
          partitionOffset,
          unclesTopic,
          canonicalKeySchemaAndValue.schema(),
          canonicalKeySchemaAndValue.value(),
          AvroToConnect.toConnectSchema(UncleListRecord.`SCHEMA$`),
          null
        )


      }

}
