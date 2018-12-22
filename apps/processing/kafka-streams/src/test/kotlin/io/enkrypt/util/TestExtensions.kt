package io.enkrypt.util

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.kafka.mapping.ObjectMapper
import io.enkrypt.kafka.streams.models.ChainEvent
import org.ethereum.core.BlockSummary
import org.ethereum.util.blockchain.StandaloneBlockchain
import java.util.concurrent.TimeUnit

infix fun ChainEvent.shouldBe(expected: ChainEvent) {

}
