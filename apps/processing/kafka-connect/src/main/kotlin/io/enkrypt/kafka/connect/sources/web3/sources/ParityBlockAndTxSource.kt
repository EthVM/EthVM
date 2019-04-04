package io.enkrypt.kafka.connect.sources.web3.sources

import io.enkrypt.avro.capture.BlockHeaderRecord
import io.enkrypt.avro.capture.CanonicalKeyRecord
import io.enkrypt.avro.capture.TransactionListRecord
import io.enkrypt.avro.capture.TransactionRecord
import io.enkrypt.common.extensions.setNumberBI
import io.enkrypt.kafka.connect.utils.AvroToConnect
import io.enkrypt.kafka.connect.sources.web3.JsonRpc2_0ParityExtended
import io.enkrypt.kafka.connect.sources.web3.toBlockHeaderRecord
import io.enkrypt.kafka.connect.sources.web3.toTransactionRecord
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.methods.response.Transaction

class ParityBlockAndTxSource(
  sourceContext: SourceTaskContext,
  parity: JsonRpc2_0ParityExtended,
  private val blocksTopic: String,
  private val txsBlockTopic: String
) : ParityEntitySource(sourceContext, parity) {

  override val partitionKey: Map<String, Any> = mapOf("model" to "blockAndTx")

  override fun fetchRange(range: LongRange): List<SourceRecord> {

    // force into long for iteration

    val longRange = LongRange(range.start, range.endInclusive)

    return longRange
      .map { blockNumber ->

        val blockNumberBI = blockNumber.toBigInteger()
        val blockParam = DefaultBlockParameter.valueOf(blockNumberBI)

        val partitionOffset = mapOf("blockNumber" to blockNumber)

        val blockFuture = parity.ethGetBlockByNumber(blockParam, true).sendAsync()
          .thenApply { resp ->

            val block = resp.block

            val blockKeyRecord = CanonicalKeyRecord.newBuilder()
              .setNumberBI(blockNumberBI)
              .build()

            val blockRecord = block
              .toBlockHeaderRecord(BlockHeaderRecord.newBuilder())
              .build()

            val keySchemaAndValue = AvroToConnect.toConnectData(blockKeyRecord)
            val valueSchemaAndValue = AvroToConnect.toConnectData(blockRecord)

            val headerSourceRecord =
              SourceRecord(partitionKey, partitionOffset, blocksTopic,
                keySchemaAndValue.schema(), keySchemaAndValue.value(),
                valueSchemaAndValue.schema(), valueSchemaAndValue.value()
              )

            // transactions

            val canonicalKeyRecord = CanonicalKeyRecord
              .newBuilder()
              .setNumberBI(blockNumberBI)
              .build()

            val canonicalKeySchemaAndValue = AvroToConnect.toConnectData(canonicalKeyRecord)

            val transactionListRecord = TransactionListRecord.newBuilder()
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
                partitionKey, partitionOffset, txsBlockTopic,
                canonicalKeySchemaAndValue.schema(), canonicalKeySchemaAndValue.value(),
                txListValueSchemaAndValue.schema(), txListValueSchemaAndValue.value()
              )

            listOf(headerSourceRecord, txsSourceRecord)
          }

        blockFuture
      }.map { future ->
        // wait for everything to complete
        future.join()
      }.flatten()
  }
}
