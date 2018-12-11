package io.enkrypt.processing.eth.utils

import arrow.core.Option
import io.enkrypt.avro.common.Data32
import io.enkrypt.processing.extensions.byteBuffer
import org.ethereum.solidity.Abi
import java.nio.ByteBuffer
import java.nio.file.Files
import java.nio.file.Path

abstract class AbstractAbi protected constructor(path: Path) {

  protected val abi: Abi

  protected val functionMap: Map<ByteBuffer, Abi.Function?>
  protected val eventMap: Map<ByteBuffer, Abi.Event?>

  init {
    try {

      // load in the abi
      val json = String(Files.readAllBytes(path))
      this.abi = Abi.fromJson(json)

      // index the functions
      this.functionMap = this.functions()
        .asSequence()
        .map { name -> abi.findFunction { f -> f.name == name } }
        .map { f -> f.encodeSignature().byteBuffer()!! to f }
        .toList()
        .toMap()

      // index the events
      this.eventMap = this.events()
        .asSequence()
        .map { name -> abi.findEvent { e -> e.name == name } }
        .map { e -> e.encodeSignature().byteBuffer()!! to e }
        .toList()
        .toMap()

    } catch (ex: Exception) {
      throw RuntimeException(ex)
    }

  }

  protected abstract fun functions(): Set<String>

  protected abstract fun events(): Set<String>

  fun matchFunction(data: ByteArray?): Option<Abi.Function> {
    if (data == null || data.size < 4) return Option.empty()

    val key = data.copyOfRange(0, 4).byteBuffer()
    return Option.fromNullable(functionMap[key])
  }

  fun matchEvent(topics: List<Data32>): Option<Abi.Event> =
    if (topics.isEmpty()) Option.empty() else matchEvent(topics[0])

  fun matchEvent(word: Data32): Option<Abi.Event> = Option.fromNullable(eventMap[word.bytes().byteBuffer()])

}
