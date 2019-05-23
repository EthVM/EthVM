package com.ethvm.kafka.connect.sources.web3.sources

import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TransactionListRecord
import com.ethvm.avro.capture.TransactionRecord
import com.ethvm.common.extensions.setNumberBI
import com.ethvm.kafka.connect.sources.web3.ext.JsonRpc2_0ParityExtended
import com.ethvm.kafka.connect.sources.web3.ext.toBlockHeaderRecord
import com.ethvm.kafka.connect.sources.web3.ext.toTransactionRecord
import com.ethvm.kafka.connect.sources.web3.utils.AvroToConnect
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext
import org.web3j.protocol.core.methods.response.Transaction
import java.math.BigInteger

class ParityBlockHeadersAndTxsSource(
  sourceContext: SourceTaskContext,
  parity: JsonRpc2_0ParityExtended,
  private val blocksTopic: String,
  private val txsBlockTopic: String,
  syncStateTopic: String
) : AbstractParityEntitySource(sourceContext, parity, syncStateTopic) {

  override val partitionKey: Map<String, Any> = mapOf("model" to "block_header")

  private val blockTimestamps = sortedMapOf<BigInteger, Int>()

  override fun fetchRange(range: LongRange): List<SourceRecord> {

    val resp = parity
      .ethvmGetBlocksByNumber(
        range.first.toBigInteger(),
        range.endInclusive.toBigInteger(),
        true
      ).send()

    val result = resp.blocks
      .map { block ->

        val blockNumber = block.number

        val partitionOffset = mapOf("blockNumber" to blockNumber.toLong())

        val blockKeyRecord = CanonicalKeyRecord.newBuilder()
          .setNumberBI(blockNumber)
          .build()

        val blockTime = when (val prevTimestamp = blockTimestamps[blockNumber.minus(BigInteger.ONE)]) {
          null -> 0 // should only occur for genesis block
          else -> block.timestamp.toInt() - prevTimestamp
        }

        val blockRecord = block
          .toBlockHeaderRecord(BlockHeaderRecord.newBuilder(), blockTime)
          .build()

        val keySchemaAndValue = AvroToConnect.toConnectData(blockKeyRecord)
        val valueSchemaAndValue = AvroToConnect.toConnectData(blockRecord)

        val headerSourceRecord =
          SourceRecord(
            partitionKey,
            partitionOffset,
            blocksTopic,
            keySchemaAndValue.schema(),
            keySchemaAndValue.value(),
            valueSchemaAndValue.schema(),
            valueSchemaAndValue.value()
          )

        // transactions

        val canonicalKeyRecord = CanonicalKeyRecord.newBuilder()
          .setNumberBI(blockNumber)
          .build()

        val canonicalKeySchemaAndValue = AvroToConnect.toConnectData(canonicalKeyRecord)

        val transactionListRecord = TransactionListRecord.newBuilder()
          .setBlockHash(blockRecord.getHash())
          .setTransactions(
            block.transactions
              .map { txResp -> txResp.get() as Transaction }
              .map { tx ->
                tx.toTransactionRecord(
                  TransactionRecord
                    .newBuilder()
                    .setTimestamp(block.timestamp.longValueExact())
                ).build()
              }
          ).build()

        val txListValueSchemaAndValue = AvroToConnect.toConnectData(transactionListRecord)

        val txsSourceRecord =
          SourceRecord(
            partitionKey,
            partitionOffset,
            txsBlockTopic,
            canonicalKeySchemaAndValue.schema(),
            canonicalKeySchemaAndValue.value(),
            txListValueSchemaAndValue.schema(),
            txListValueSchemaAndValue.value()
          )


        listOf(headerSourceRecord, txsSourceRecord)

      }.flatten()

    cleanTimestamps()

    return result
  }

  private fun cleanTimestamps() {

    while (blockTimestamps.size > 5000) {
      // map is ordered, remove older entries first
      blockTimestamps.remove(blockTimestamps.firstKey())
    }

  }

  override fun tombstonesForRange(range: LongRange): List<SourceRecord> =
    range
      .map { blockNumber ->

        val blockNumberBI = blockNumber.toBigInteger()
        val partitionOffset = mapOf("blockNumber" to blockNumber)

        val blockKeyRecord = CanonicalKeyRecord.newBuilder()
          .setNumberBI(blockNumberBI)
          .build()

        val keySchemaAndValue = AvroToConnect.toConnectData(blockKeyRecord)

        val headerSourceRecord =
          SourceRecord(
            partitionKey,
            partitionOffset,
            blocksTopic,
            keySchemaAndValue.schema(),
            keySchemaAndValue.value(),
            AvroToConnect.toConnectSchema(BlockHeaderRecord.`SCHEMA$`),
            null
          )

        // transactions

        val canonicalKeyRecord = CanonicalKeyRecord.newBuilder()
          .setNumberBI(blockNumberBI)
          .build()

        val canonicalKeySchemaAndValue = AvroToConnect.toConnectData(canonicalKeyRecord)

        val txsSourceRecord =
          SourceRecord(
            partitionKey,
            partitionOffset,
            txsBlockTopic,
            canonicalKeySchemaAndValue.schema(),
            canonicalKeySchemaAndValue.value(),
            AvroToConnect.toConnectSchema(TransactionListRecord.`SCHEMA$`),
            null
          )

        listOf(headerSourceRecord, txsSourceRecord)
      }
      .flatten()
}
