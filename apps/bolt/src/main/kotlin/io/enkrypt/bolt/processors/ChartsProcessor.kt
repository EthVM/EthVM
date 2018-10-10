package io.enkrypt.bolt.processors

import com.mongodb.client.model.ReplaceOptions
import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.kafka.serdes.BigIntegerSerde
import io.enkrypt.bolt.kafka.serdes.DateSerde
import io.enkrypt.bolt.kafka.serdes.RLPBlockSummarySerde
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Serialized
import org.bson.Document
import org.ethereum.core.BlockSummary
import java.math.BigInteger
import java.util.Calendar
import java.util.Date
import java.util.Properties
import java.util.TimeZone

/**
 * This processor processes different statistics.
 */
class ChartsProcessor : AbstractBaseProcessor() {

  override val id: String = "charts-processor"

  private val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 2)
    }

  private val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {

    // Serdes
    val blockSerde = RLPBlockSummarySerde()
    val bigIntegerSerde = BigIntegerSerde()
    val dateSerde = DateSerde()

    // Create stream builder
    val builder = StreamsBuilder()

    val blocksByDay: KStream<Date, BlockSummary> = builder
      .stream(
        appConfig.topicsConfig.blocks,
        Consumed.with(Serdes.ByteArray(), blockSerde)
      )
      .map { _, v -> KeyValue(timestampToDay(v.block.timestamp), v) }

    // Blocks count

    val blockCountByDay = blocksByDay
      .mapValues { v -> v.block.hash.toHex() }
      .groupByKey(Serialized.with(dateSerde, Serdes.String()))
      .count(Materialized.with(dateSerde, Serdes.Long()))

    // Avg Total Difficulty

    blocksByDay
      .mapValues { v -> v.block.cumulativeDifficulty }
      .groupByKey(Serialized.with(dateSerde, bigIntegerSerde))
      .aggregate(
        { BigInteger.ZERO },
        { _, difficulty, total -> total.add(difficulty) },
        Materialized.with(dateSerde, bigIntegerSerde)
      ).join(
        blockCountByDay,
        { total, count ->
          total.divide(BigInteger.valueOf(count))
        },
        Materialized.with(dateSerde, bigIntegerSerde)
      ).toStream()
      .foreach { date, value -> persistStatistic("avg_total_difficulty", date, value.toLong()) }

    // Avg Gas Price

    blocksByDay
      .mapValues { v -> v.statistics.avgGasPrice }
      .groupByKey(Serialized.with(dateSerde, bigIntegerSerde))
      .aggregate(
        { BigInteger.ZERO },
        { _, avgGasPrice, total -> total.add(avgGasPrice) },
        Materialized.with(dateSerde, bigIntegerSerde)
      ).join(
        blockCountByDay,
        { total, count -> total.divide(BigInteger.valueOf(count)) },
        Materialized.with(dateSerde, bigIntegerSerde)
      ).toStream()
      .foreach { date, value -> persistStatistic("avg_gas_price", date, value.toLong()) }

    // Avg Txs Fees

    blocksByDay
      .mapValues { v -> v.statistics.avgTxsFees }
      .groupByKey(Serialized.with(dateSerde, bigIntegerSerde))
      .aggregate(
        { BigInteger.ZERO },
        { _, avgFees, total -> total.add(avgFees) },
        Materialized.with(dateSerde, bigIntegerSerde)
      ).join(
        blockCountByDay,
        { total, count ->
          total.divide(BigInteger.valueOf(count))
        },
        Materialized.with(dateSerde, bigIntegerSerde)
      ).toStream()
      .foreach { date, value -> persistStatistic("avg_tx_fees", date, value.toLong()) }

    // Avg Failed Txs

    blocksByDay
      .mapValues { v -> v.statistics.numFailedTxs }
      .groupByKey(Serialized.with(dateSerde, Serdes.Integer()))
      .aggregate(
        { 0 },
        { _, numFailedTxs, total ->
          total + numFailedTxs
        },
        Materialized.with(dateSerde, Serdes.Integer())
      ).join(
        blockCountByDay,
        { total, count -> total / count },
        Materialized.with(dateSerde, Serdes.Long())
      ).toStream()
      .foreach { date, value -> persistStatistic("avg_failed_txs", date, value.toLong()) }

    // Avg Successful Txs

    blocksByDay
      .mapValues { v -> v.statistics.numSuccessfulTxs }
      .groupByKey(Serialized.with(dateSerde, Serdes.Integer()))
      .aggregate(
        { 0 },
        { _, numSuccessfulTxs, total ->
          total + numSuccessfulTxs
        },
        Materialized.with(dateSerde, Serdes.Integer())
      ).join(
        blockCountByDay,
        { total, count -> total / count },
        Materialized.with(dateSerde, Serdes.Long())
      ).toStream()
      .foreach { date, value -> persistStatistic("avg_successful_txs", date, value.toLong()) }

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

  private fun timestampToDay(timestampSeconds: Long): Date {
    val cal = Calendar.getInstance(TimeZone.getTimeZone("UTC"))
    with(cal) {
      timeInMillis = timestampSeconds * 1000
      set(Calendar.HOUR_OF_DAY, 0)
      set(Calendar.MINUTE, 0)
      set(Calendar.SECOND, 0)
      set(Calendar.MILLISECOND, 0)
    }
    return cal.time
  }

  private fun persistStatistic(name: String, date: Date, value: Long) {

    val filter = Document(mapOf(
      "name" to name,
      "date" to date
    ))

    val options = ReplaceOptions().upsert(true)
    statsCollection.replaceOne(filter, Document(mapOf(
      "name" to name,
      "date" to date,
      "value" to value)
    ), options)

    logger.info { "Persisting stat: $name, $date, $value" }

  }

  override fun start() {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start()
  }
}




