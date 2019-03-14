package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.processing.BalanceType
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenBalanceRecord
import io.enkrypt.avro.processing.TokenTransferListRecord
import io.enkrypt.avro.processing.TokenTransferRecord
import io.enkrypt.common.extensions.bigInteger
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.toTokenTransfers
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.kafka.streams.serdes.Serdes
import mu.KotlinLogging
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Joined
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Produced
import java.math.BigInteger
import java.util.Properties
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

class EtherBalanceProcessor : AbstractKafkaProcessor() {

  override val id: String = "ether-balance-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
      put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 1000L)
      put(ProducerConfig.MAX_REQUEST_SIZE_CONFIG, 2000000000)
    }

  override val logger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    val builder = StreamsBuilder().apply {

    }

    // generate fungible token movements

    builder
      // keyed by tx hash
      .stream("transaction-traces", Consumed.with(Serdes.TransactionKey(), Serdes.TraceList()))
      .filter { k, _ -> k.getTxHash() != null }
      .mapValues { _, tracesList ->
        TokenTransferListRecord.newBuilder()
          .setTokenTransfers(tracesList.toTokenTransfers())
          .build()
      }
      .to("transaction-ether-transfers", Produced.with(Serdes.TransactionKey(), Serdes.TokenTransferList()))


    val canonicalTxTable =
      builder.table("canonical-transactions-concurrent", Consumed.with(Serdes.TransactionKey(), Serdes.CanonicalApply()))

    val txEtherTransferTable =
      builder.table("transaction-ether-transfers", Consumed.with(Serdes.TransactionKey(), Serdes.TokenTransferList()))


    canonicalTxTable.join(
      txEtherTransferTable,
      { canonical, transfersList ->
        TokenTransferListRecord
          .newBuilder()
          .setTokenTransfers(
            transfersList.getTokenTransfers()
              .map { trace ->

                // need to make amount signed so we can aggregate later and to also take into account whether this transfer should be applied or not

                val amount = trace.getAmount().unsignedBigInteger()!!

                TokenTransferRecord.newBuilder(trace)
                  .setAmount(
                    if(canonical.getApply()) amount.byteBuffer() else amount.negate().byteBuffer()
                  ).build()
              }
          ).build()
      },
      Materialized.with(Serdes.TransactionKey(), Serdes.TokenTransferList())
    ).toStream()
      .to("canonical-transaction-ether-transfers", Produced.with(Serdes.TransactionKey(), Serdes.TokenTransferList()))

    builder
      .stream("canonical-transaction-ether-transfers", Consumed.with(Serdes.TransactionKey(), Serdes.TokenTransferList()))
      .flatMapValues { v -> v.getTokenTransfers() }
      .groupBy { _, v ->

        // technically we could receive a tombstone but based on how the processing pipeline is setup we shouldn't
        require(v != null) { "Tombstone received" }

        TokenBalanceKeyRecord.newBuilder()
          .setBalanceType(BalanceType.ETHER)
          .setAddress(v.getTo())
          .build()

      }
      .aggregate(
        {
          TokenBalanceRecord.newBuilder()
            .setAmount(BigInteger.ZERO.byteBuffer())
            .build()
        },
        { _, transfer, balance ->

          TokenBalanceRecord.newBuilder()
            .setAmount(
              (transfer.getAmount().bigInteger()!! + balance.getAmount().bigInteger()!!).byteBuffer()
            ).build()

        },
        Materialized.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance())
      ).toStream()
      .to("balances", Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance()))

    // Generate the topology
    return builder.build()
  }

  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }
}
