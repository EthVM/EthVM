package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.FungibleBalanceKeyRecord
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.kstream.KStream

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
