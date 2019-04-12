package com.ethvm.kafka.connect.sources.web3.sources

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.UncleListRecord
import com.ethvm.avro.capture.UncleRecord
import com.ethvm.common.extensions.setNumberBI
import com.ethvm.kafka.connect.sources.web3.ext.JsonRpc2_0ParityExtended
import com.ethvm.kafka.connect.sources.web3.ext.toUncleRecord
import com.ethvm.kafka.connect.sources.web3.utils.AvroToConnect
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.methods.response.EthBlock
import java.util.stream.Collectors

class ParityUnclesSource(
  sourceContext: SourceTaskContext,
  parity: JsonRpc2_0ParityExtended,
  private val unclesTopic: String
) : AbstractParityEntitySource(sourceContext, parity) {

  override val partitionKey: Map<String, Any> = mapOf("model" to "uncle")

  override fun fetchRange(range: LongRange): List<SourceRecord> =
    range
      .map { blockNumber ->

        val blockNumberBI = blockNumber.toBigInteger()
        val blockParam = DefaultBlockParameter.valueOf(blockNumberBI)

        val partitionOffset = mapOf("blockNumber" to blockNumber)

        parity
          .ethGetUncleCountByBlockNumber(blockParam)
          .sendAsync()
          .thenApply { resp ->

            val uncleCount = resp.uncleCount.toLong()

            return@thenApply if (uncleCount > 0) {
              0.until(uncleCount)
                .map { pos ->

                  parity
                    .ethGetUncleByBlockNumberAndIndex(blockParam, pos.toBigInteger())
                    .sendAsync()
                }
                .stream()
                .map { it.join() }
                .collect(Collectors.toList())
                .let { uncles: MutableList<EthBlock> ->

                  val blockKeyRecord = CanonicalKeyRecord.newBuilder()
                    .setNumberBI(blockNumberBI)
                    .build()

                  val uncleListRecord = UncleListRecord.newBuilder()
                    .setUncles(uncles.map { u -> u.block.toUncleRecord(blockNumberBI, UncleRecord.newBuilder()).build() })
                    .build()

                  val keySchemaAndValue = AvroToConnect.toConnectData(blockKeyRecord)
                  val valueSchemaAndValue = AvroToConnect.toConnectData(uncleListRecord)

                  val unclesSourceRecord =
                    SourceRecord(
                      partitionKey,
                      partitionOffset,
                      unclesTopic,
                      keySchemaAndValue.schema(),
                      keySchemaAndValue.value(),
                      valueSchemaAndValue.schema(),
                      valueSchemaAndValue.value()
                    )

                  listOf(unclesSourceRecord)
                }
            } else {
              emptyList()
            }
          }
      }
      .map { future -> future.join() }
      .flatten()

  override fun tombstonesForRange(range: LongRange): List<SourceRecord> =
    range
      .map { blockNumber ->

        val blockNumberBI = blockNumber.toBigInteger()
        val partitionOffset = mapOf("blockNumber" to blockNumber)

        val blockKeyRecord = CanonicalKeyRecord.newBuilder()
          .setNumberBI(blockNumberBI)
          .build()

        val keySchemaAndValue = AvroToConnect.toConnectData(blockKeyRecord)

        val uncleSourceRecord =
          SourceRecord(
            partitionKey,
            partitionOffset,
            unclesTopic,
            keySchemaAndValue.schema(),
            keySchemaAndValue.value(),
            AvroToConnect.toConnectSchema(UncleListRecord.`SCHEMA$`),
            null
          )

        listOf(uncleSourceRecord)

      }
      .flatten()
}