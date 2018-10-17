package io.enkrypt.bolt.processors

import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.UpdateOneModel
import com.mongodb.client.model.UpdateOptions
import io.enkrypt.bolt.kafka.processors.MongoProcessor
import io.enkrypt.bolt.kafka.serdes.BigIntegerSerde
import io.enkrypt.bolt.kafka.serdes.DateSerde
import io.enkrypt.bolt.kafka.serdes.RLPBlockStatisticsSerde
import io.enkrypt.bolt.kafka.serdes.RLPBlockSummarySerde
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.*
import org.apache.kafka.streams.processor.Cancellable
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.processor.PunctuationType
import org.bson.Document
import org.ethereum.util.ByteUtil
import org.koin.standalone.get
import org.koin.standalone.inject
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

  override val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {

    // Serdes
    val blockSummarySerde = RLPBlockSummarySerde()
    val blockStatisticsSerde = RLPBlockStatisticsSerde()
    val bigIntegerSerde = BigIntegerSerde()
    val dateSerde = DateSerde()

    // Create stream builder
    val builder = StreamsBuilder()

    val blocksStream = builder.stream(
      appConfig.topicsConfig.blocks,
      Consumed.with(Serdes.ByteArray(), blockSummarySerde)
    )

    val statsByDay = blocksStream
      .map { k, v -> KeyValue(ByteUtil.byteArrayToLong(k), v) }
      .groupByKey(Serialized.with(Serdes.Long(), blockSummarySerde))
      .reduce(
        { a, b -> if (a.totalDifficulty >= b.totalDifficulty) a else b },
        Materialized.with(Serdes.Long(), blockSummarySerde)
      ).groupBy(
        { _, v ->
          KeyValue(timestampToDay(v.block.timestamp), v.statistics.setTotalDifficulty(v.block.cumulativeDifficulty) )
        },
        Serialized.with(dateSerde, blockStatisticsSerde)
      )

    // Blocks count per day
    // --------------------

    val blockCountByDay = statsByDay.count()

    // Avg Total Difficulty
    // --------------------

    statsByDay
      .aggregate(
        { BigInteger.ZERO },
        { _, v, total -> total.add(v.totalDifficulty) },
        { _, v, total -> total.subtract(v.totalDifficulty) },
        Materialized.with(dateSerde, bigIntegerSerde)
      ).join(
        blockCountByDay,
        { total, count -> if(count == 0L) BigInteger.ZERO else total.divide(BigInteger.valueOf(count)) },
        Materialized.with(dateSerde, bigIntegerSerde)
      )
      .toStream()
      .mapValues { v -> Pair("avg_total_difficulty", v.toLong()) }
      .process({ get<StatisticMongoProcessor>() }, null)

    // Avg Gas Price
    // -------------

    statsByDay
      .aggregate(
        { BigInteger.ZERO },
        { _, v, total -> total.add(v.avgGasPrice) },
        { _, v, total -> total.subtract(v.avgGasPrice) },
        Materialized.with(dateSerde, bigIntegerSerde)
      ).join(
        blockCountByDay,
        { total, count -> if(count == 0L) BigInteger.ZERO else total.divide(BigInteger.valueOf(count)) },
        Materialized.with(dateSerde, bigIntegerSerde)
      )
      .toStream()
      .mapValues { v -> Pair("avg_gas_price", v.toLong()) }
      .process({ get<StatisticMongoProcessor>() }, null)


    // Avg Txs Fees
    // ------------

    statsByDay
      .aggregate(
        { BigInteger.ZERO },
        { _, v, total -> total.add(v.avgTxsFees) },
        { _, v, total -> total.subtract(v.avgTxsFees) },
        Materialized.with(dateSerde, bigIntegerSerde)
      ).join(
        blockCountByDay,
        { total, count -> if(count == 0L) BigInteger.ZERO else total.divide(BigInteger.valueOf(count)) },
        Materialized.with(dateSerde, bigIntegerSerde)
      )
      .toStream()
      .mapValues { v -> Pair("avg_txs_fees", v.toLong()) }
      .process({ get<StatisticMongoProcessor>() }, null)


    // Avg Failed Txs
    // ------------------

    statsByDay
      .aggregate(
        { 0 },
        { _, v, total -> total + v.numFailedTxs },
        { _, v, total -> total - v.numFailedTxs },
        Materialized.with(dateSerde, Serdes.Integer())
      ).join(
        blockCountByDay,
        { total, count -> if(count == 0L) 0 else total / count },
        Materialized.with(dateSerde, Serdes.Long())
      )
      .toStream()
      .mapValues { v -> Pair("avg_failed_txs", v.toLong()) }
      .process({ get<StatisticMongoProcessor>() }, null)

    // Avg Successful Txs
    // ------------------

    statsByDay
      .aggregate(
        { 0 },
        { _, v, total -> total + v.numSuccessfulTxs },
        { _, v, total -> total - v.numSuccessfulTxs },
        Materialized.with(dateSerde, Serdes.Integer())
      ).join(
        blockCountByDay,
        { total, count -> if(count == 0L) 0 else total / count },
        Materialized.with(dateSerde, Serdes.Long())
      )
      .toStream()
      .mapValues { v -> Pair("avg_successful_txs", v.toLong()) }
      .process({ get<StatisticMongoProcessor>() }, null)

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

}

class StatisticMongoProcessor : MongoProcessor<Date, Pair<String, Long>>() {

  private val statsCollection: MongoCollection<Document> by lazy {
    mongoDB.getCollection(config.mongo.statisticsCollection)
  }

  private var batch = mapOf<Pair<Date, String>, Long>()
  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext) {
    super.init(context)
    this.scheduledWrite = context.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun process(key: Date, value: Pair<String, Long>) {
    batch += Pair(key, value.first) to value.second
  }

  private fun tryToWrite() {
    if (!running || batch.isEmpty()) {
      return
    }

    val startMs = System.currentTimeMillis()
    val updateOptions = UpdateOptions().upsert(true)

    val ops = batch.toList().map{ kv ->

      val date = kv.first.first
      val name = kv.first.second
      val value = kv.second

      val filter = Document(mapOf("name" to name, "date" to date))

      UpdateOneModel<Document>(filter, Document(mapOf("\$set" to Document(mapOf("name" to name, "date" to date, "value" to value)))), updateOptions)
    }

    try {

      statsCollection.bulkWrite(ops)

      context.commit()

      val elapsedMs = System.currentTimeMillis() - startMs
      logger.info { "${batch.size} stats updated in $elapsedMs ms" }

      batch = emptyMap()

    } catch (e: Exception) {
      logger.error { "Failed to update stats. $e" }
    }

  }

  override fun close() {
    running = false
    scheduledWrite?.cancel()
  }

}





