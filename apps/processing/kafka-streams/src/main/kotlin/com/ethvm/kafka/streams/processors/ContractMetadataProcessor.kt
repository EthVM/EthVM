package com.ethvm.kafka.streams.processors

import com.ethvm.avro.common.ContractType
import com.ethvm.avro.processing.Erc20MetadataRecord
import com.ethvm.avro.processing.Erc721MetadataRecord
import com.ethvm.common.extensions.byteBuffer
import com.ethvm.kafka.streams.config.Topics.Contract
import com.ethvm.kafka.streams.config.Topics.Erc20Metadata
import com.ethvm.kafka.streams.config.Topics.Erc721Metadata
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.koin.core.inject
import org.web3j.abi.FunctionEncoder
import org.web3j.abi.FunctionReturnDecoder
import org.web3j.abi.TypeReference
import org.web3j.abi.datatypes.Utf8String
import org.web3j.abi.datatypes.generated.Uint256
import org.web3j.abi.datatypes.generated.Uint8
import org.web3j.protocol.Web3j
import org.web3j.protocol.core.DefaultBlockParameterName
import org.web3j.protocol.core.methods.request.Transaction
import java.math.BigInteger
import java.util.Properties
import java.util.concurrent.CompletableFuture
import org.web3j.abi.datatypes.Function as AbiFunction

class ContractMetadataProcessor : AbstractKafkaProcessor() {

  override val id: String = "contract-metadata-processor"

  private val zeroAddress = "0x0000000000000000000000000000000000000000"

  private val nonUtf8Regex = Regex("[^\\u0000-\\uFFFF]")

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  private val web3: Web3j by inject()

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    val contractStream = Contract.stream(builder)

    // erc20
    contractStream
      // we only want creations
      .filter { _, v -> v.contractType == ContractType.ERC20 && v.traceDestroyedAt == null }
      .mapValues { k, v ->

        val name = fetchName(k.address)
        val symbol = fetchSymbol(k.address)
        val decimals = fetchDecimals(k.address)
        val totalSupply = fetchTotalSupply(k.address)

        Erc20MetadataRecord.newBuilder()
          .setTimestamp(v.getTimestamp())
          .setName(name.join())
          .setSymbol(symbol.join())
          .setDecimals(decimals.join()?.intValueExact())
          .setTotalSupply(totalSupply.join()?.byteBuffer())
          .build()

      }.toTopic(Erc20Metadata)

    // erc721
    contractStream
      // we only want creations
      .filter { _, v -> v.contractType == ContractType.ERC721 && v.traceDestroyedAt == null }
      .mapValues { k, v ->

        val name = fetchName(k.address)
        val symbol = fetchSymbol(k.address)

        Erc721MetadataRecord.newBuilder()
          .setTimestamp(v.getTimestamp())
          .setName(name.join())
          .setSymbol(symbol.join())
          .build()

      }.toTopic(Erc721Metadata)

    return builder.build()
  }

  private fun fetchName(contractAddress: String) = fetchString(contractAddress, "name")

  private fun fetchSymbol(contractAddress: String) = fetchString(contractAddress, "symbol")

  private fun fetchString(contractAddress: String, method: String): CompletableFuture<String?> {
    val function = AbiFunction(method, emptyList(), listOf(object : TypeReference<Utf8String>() {}))
    val encoded = FunctionEncoder.encode(function)
    return web3.ethCall(
      Transaction.createEthCallTransaction(zeroAddress, contractAddress, encoded),
      DefaultBlockParameterName.LATEST
    ).sendAsync()
      .thenApply { call ->
        val output = FunctionReturnDecoder.decode(call.value, function.outputParameters)
        val result = output
          .firstOrNull()?.value as String?

        // Some values can have non-four-byte-UTF-8 characters
        result?.replace(nonUtf8Regex, "")
      }.handle { result, ex ->
        when (ex) {
          null -> result
          else -> {
            logger.warn { "Failed to fetch string. Contract address = $contractAddress, method = $method, error = ${ex.message}" }
            null
          }
        }
      }
  }

  private fun fetchDecimals(contractAddress: String): CompletableFuture<BigInteger?> {
    val function = AbiFunction("decimals", emptyList(), listOf(object : TypeReference<Uint8>() {}))
    val encoded = FunctionEncoder.encode(function)
    return web3.ethCall(
      Transaction.createEthCallTransaction(zeroAddress, contractAddress, encoded),
      DefaultBlockParameterName.LATEST
    ).sendAsync()
      .thenApply { call ->
        val output = FunctionReturnDecoder.decode(call.value, function.outputParameters)
        output.firstOrNull()?.value as BigInteger?
      }
      .handle { result, ex ->
        when (ex) {
          null -> result
          else -> {
            logger.warn { "Failed to fetch decimals. Contract address = $contractAddress, error = ${ex.message}" }
            null
          }
        }
      }
  }

  private fun fetchTotalSupply(contractAddress: String): CompletableFuture<BigInteger?> {
    val function = AbiFunction("totalSupply", emptyList(), listOf(object : TypeReference<Uint256>() {}))
    val encoded = FunctionEncoder.encode(function)
    return web3.ethCall(
      Transaction.createEthCallTransaction(zeroAddress, contractAddress, encoded),
      DefaultBlockParameterName.LATEST
    ).sendAsync()
      .thenApply { call ->
        val output = FunctionReturnDecoder.decode(call.value, function.outputParameters)
        output.firstOrNull()?.value as BigInteger?
      }
      .handle { result, ex ->
        when (ex) {
          null -> result
          else -> {
            logger.warn { "Failed to fetch total supply. Contract address = $contractAddress, error = ${ex.message}" }
            null
          }
        }
      }
  }
}
