package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.FungibleBalanceKeyRecord
import com.ethvm.common.extensions.reverse
import com.ethvm.kafka.streams.Serdes
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.Materialized

abstract class AbstractFungibleBalanceDeltaProcessor : AbstractKafkaProcessor() {

  protected fun toAccountDeltas(deltaStream: KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord?>) =
    deltaStream
      .flatMap { _, v ->

        // we should not receive any null values, this is just an artifact of the type system

        if (v!!.getApply()) {

          (v.getDeltas() + v.getReversals())
            .map { delta ->
              KeyValue(
                FungibleBalanceKeyRecord.newBuilder()
                  .setAddress(delta.getAddress())
                  .setContract(delta.getContractAddress())
                  .build(),
                delta
              )
            }
        } else {
          emptyList()
        }
      }

  protected fun withReversals(stream: KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord?>) =
    stream
      .groupByKey(Grouped.with(Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList()))
      .reduce(
        { agg, next ->

          // null values does not trigger this reduce, so in the case of a reorg we will only trigger
          // when the updated value is available

          if (next!!.getBlockHash() == agg!!.getBlockHash()) {

            // an update has been published for a previously seen block
            // we assume no material change and therefore emit an event which will have no impact on the balances

            logger.warn { "Update received. Agg = $agg, next = $next" }

            FungibleBalanceDeltaListRecord.newBuilder(agg)
              .setTimestamp(next.getTimestamp())
              .setApply(false)
              .build()
          } else {

            // reverse previous deltas

            FungibleBalanceDeltaListRecord.newBuilder()
              .setTimestamp(next.getTimestamp())
              .setBlockHash(next.getBlockHash())
              .setDeltas(next.getDeltas())
              .setReversals(agg.getDeltas().map { it.reverse() })
              .build()
          }
        },
        Materialized.with(Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList())
      )
      .toStream()

}
