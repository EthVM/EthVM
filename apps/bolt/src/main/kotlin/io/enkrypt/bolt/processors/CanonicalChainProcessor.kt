package io.enkrypt.bolt.processors

import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Produced
import org.apache.kafka.streams.kstream.Transformer
import org.apache.kafka.streams.processor.Cancellable
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.processor.PunctuationType
import org.apache.kafka.streams.state.KeyValueStore
import org.apache.kafka.streams.state.Stores
import java.util.*

class CanonicalChainProcessor : AbstractBaseProcessor() {

  override val id: String = "canonical-chain-processor"

  private val logger = KotlinLogging.logger {}

  private val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override fun onPrepareProcessor() {

    // Create stream builder
    val builder = StreamsBuilder()

    builder.addStateStore(
      Stores.keyValueStoreBuilder(
        Stores.persistentKeyValueStore("canonical-chain-store"),
        Serdes.Long(),
        Serdes.String()
      ))

    builder
      .stream(appConfig.topicsConfig.processedBlocks, Consumed.with(Serdes.Long(), Serdes.String()))
      .transform<Long, String>({ ProcessedBlockTransformer("canonical-chain-store") }, arrayOf("canonical-chain-store"))
      .peek{ k, v -> logger.info("Latest processed block number: $k")}
      .map{ k, _ -> KeyValue("latest_processed_number", k.toString(16)) }
      .to(appConfig.topicsConfig.metadata, Produced.with(Serdes.String(), Serdes.String()))

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)

  }

  override fun start() {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start()
  }
}

@Suppress("UNCHECKED_CAST")
class ProcessedBlockTransformer(private val stateStoreName: String) : Transformer<Long, String, KeyValue<Long, String>> {

  private lateinit var context: ProcessorContext
  private lateinit var store: KeyValueStore<Long, String>

  private lateinit var scheduledAdvance: Cancellable
  private lateinit var scheduledPrune: Cancellable

  private val logger = KotlinLogging.logger {}

  private var greatestContiguousBlockNumber: Long?
    set (value) { store.put(-1L, value.toString())}
    get() = store.get(-1L)?.toLong()

  private var greatestPruneBlockNumber: Long?
    set (value) { store.put(-1L, value.toString())}
    get() = store.get(-1L)?.toLong()

  override fun init(context: ProcessorContext) {
    this.context = context
    this.store = context.getStateStore(stateStoreName) as KeyValueStore<Long, String>

    this.scheduledAdvance = context.schedule(1000, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToAdvance() }
    this.scheduledPrune = context.schedule(10000, PunctuationType.WALL_CLOCK_TIME) { _ -> prune() }
  }

  private fun tryToAdvance() {

    var latest = (greatestContiguousBlockNumber ?: 0L)

    logger.debug { "Trying to advance from $latest" }

    val range = store.range(latest, latest + 10000)

    for (kv in range) {
      if (kv.key == latest) {
        context.forward(kv.key, kv.value)
        latest += 1
      } else {
        break
      }
    }

    range.close()
    greatestContiguousBlockNumber = latest


  }

  private fun prune() {

    var next = (greatestPruneBlockNumber ?: -1L) + 1L
    val stop = greatestContiguousBlockNumber ?: -1L

    if(stop > -1L) {

      while (next < stop) {
        if(store.delete(next) != null) {
          next += 1
        } else {
          break
        }
      }

      greatestPruneBlockNumber = next

      logger.debug("Pruned until $next")

    }


  }

  override fun transform(key: Long?, value: String?): KeyValue<Long, String>? {
    // add to the store
    store.put(key, value)

    return null
  }

  override fun close() {
    this.scheduledAdvance.cancel()
    this.scheduledPrune.cancel()
  }
}
