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

  protected fun toAccountDeltas(deltaStream: KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord>) =
    deltaStream
      .flatMap { _, v ->

        v.deltas
          .map { delta ->
            KeyValue(
              FungibleBalanceKeyRecord.newBuilder()
                .setAddress(delta.getAddress())
                .setContract(delta.getContractAddress())
                .build(),
              delta
            )
          }

      }

}
