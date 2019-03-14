package io.enkrypt.kafka.connect.sources.web3.sources

import io.enkrypt.avro.capture.BlockHeaderRecord
import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.CanonicalKeyRecord
import io.enkrypt.avro.capture.CanonicalRecord
import io.enkrypt.avro.capture.CompositeKeyRecord
import io.enkrypt.avro.capture.TransactionKeyRecord
import io.enkrypt.avro.capture.TransactionRecord
import io.enkrypt.common.extensions.hexBuffer32
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.kafka.connect.sources.web3.AvroToConnect
import io.enkrypt.kafka.connect.sources.web3.JsonRpc2_0ParityExtended
import io.enkrypt.kafka.connect.sources.web3.toBlockHeaderRecord
import io.enkrypt.kafka.connect.sources.web3.toTransactionRecord
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.methods.response.Transaction

class ParityBlockAndTxSource(sourceContext: SourceTaskContext,
                             parity: JsonRpc2_0ParityExtended,
                             private val blocksTopic: String,
                             private val txsBlockTopic: String,
                             private val canonicalTopic: String) : ParityEntitySource(sourceContext, parity) {

  override val partitionKey: Map<String, Any> = mapOf("model" to "blockAndTx")

  override fun fetchRange(range: ClosedRange<Long>): List<SourceRecord> {

    // force into long for iteration

    val longRange = LongRange(range.start, range.endInclusive)

    return longRange
      .map { blockNumber ->

        val blockParam = DefaultBlockParameter.valueOf(blockNumber.toBigInteger())

        val partitionOffset = mapOf("blockNumber" to blockNumber)

        val blockFuture = parity.ethGetBlockByNumber(blockParam, true).sendAsync()
          .thenApply { resp ->

            val block = resp.block

            val blockKeyRecord = BlockKeyRecord
              .newBuilder()
              .setBlockHash(block.hash.hexBuffer32())
              .build()

            val blockRecord = block
              .toBlockHeaderRecord(BlockHeaderRecord.newBuilder())
              .build()

            val keySchemaAndValue = AvroToConnect.toConnectData(blockKeyRecord)
            val valueSchemaAndValue = AvroToConnect.toConnectData(blockRecord)

            var sourceRecords = listOf(
              SourceRecord(partitionKey, partitionOffset, blocksTopic,
                keySchemaAndValue.schema(), keySchemaAndValue.value(),
                valueSchemaAndValue.schema(), valueSchemaAndValue.value()
              )
            )

            // canonical chain

            val canonicalKeyRecord = CanonicalKeyRecord
              .newBuilder()
              .setNumber(blockNumber.toBigInteger().unsignedByteBuffer())
              .build()

            val canonicalRecord = CanonicalRecord.newBuilder()
              .setBlockHash(block.hash.hexBuffer32())
              .setTxHashes(
                block.transactions
                  .map { it.get() as Transaction }
                  .map { it.hash.hexBuffer32() }
              )
              .build()

            val canonicalKeySchemaAndValue = AvroToConnect.toConnectData(canonicalKeyRecord)
            val canonicalSchemaAndValue = AvroToConnect.toConnectData(canonicalRecord)

            sourceRecords = sourceRecords +
              SourceRecord(partitionKey, partitionOffset, canonicalTopic,
                canonicalKeySchemaAndValue.schema(), canonicalKeySchemaAndValue.value(),
                canonicalSchemaAndValue.schema(), canonicalSchemaAndValue.value()
              )

            // transactions

            sourceRecords +
              block.transactions
                .map { txResp -> txResp.get() as Transaction }
                .map { tx ->
                  tx.toTransactionRecord(
                    TransactionRecord
                      .newBuilder()
                      .setTimestamp(block.timestamp.longValueExact())
                  ).build()
                }.map { txRecord ->

                  val txKeyRecord = TransactionKeyRecord
                    .newBuilder()
                    .setTxHash(txRecord.getHash())
                    .build()

                  val txKeySchemaAndValue = AvroToConnect.toConnectData(txKeyRecord)
                  val txValueSchemaAndValue = AvroToConnect.toConnectData(txRecord)

                  // TODO make blocksTopic configurable
                  SourceRecord(
                    partitionKey, partitionOffset, txsBlockTopic,
                    txKeySchemaAndValue.schema(), txKeySchemaAndValue.value(),
                    txValueSchemaAndValue.schema(), txValueSchemaAndValue.value()
                  )
                }

          }

        blockFuture

      }.map { future ->
        // wait for everything to complete
        future.join()
      }.flatten()

  }
}
