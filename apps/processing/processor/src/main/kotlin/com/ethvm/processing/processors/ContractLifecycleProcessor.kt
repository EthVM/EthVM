package com.ethvm.processing.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.db.Tables
import com.ethvm.db.Tables.CONTRACT
import com.ethvm.db.routines.ClearContractDestroyedFields
import com.ethvm.db.tables.records.ContractMetadataRecord
import com.ethvm.processing.extensions.toContractRecords
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.jooq.DSLContext
import org.koin.core.inject
import org.koin.core.qualifier.named
import org.web3j.abi.FunctionEncoder
import org.web3j.abi.FunctionReturnDecoder
import org.web3j.abi.TypeReference
import org.web3j.abi.datatypes.Function
import org.web3j.abi.datatypes.Utf8String
import org.web3j.abi.datatypes.generated.Uint256
import org.web3j.abi.datatypes.generated.Uint8
import org.web3j.protocol.Web3j
import org.web3j.protocol.core.DefaultBlockParameterName
import org.web3j.protocol.core.methods.request.Transaction
import java.math.BigInteger
import java.util.concurrent.CompletableFuture
import kotlin.math.min

class ContractLifecycleProcessor : AbstractProcessor<TraceListRecord>() {

  private val ETHEREUM_ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

  override val logger = KotlinLogging.logger {}

  override val processorId: String = "contract-lifecycle-processor"

  private val topicTraces: String by inject(named("topicTraces"))

  private val web3: Web3j by inject()

  override val topics = listOf(topicTraces)

  override fun initialise(txCtx: DSLContext, latestSyncBlock: BigInteger?) {}

  override fun blockHashFor(value: TraceListRecord) = value.blockHash

  override fun reset(txCtx: DSLContext) {

    txCtx
      .truncate(CONTRACT)
      .execute()
  }

  override fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger) {

    val blockNumberDecimal = blockNumber.toBigDecimal()

    txCtx
      .deleteFrom(CONTRACT)
      .where(Tables.CONTRACT.CREATED_AT_BLOCK_NUMBER.ge(blockNumberDecimal))
      .execute()

    // we use a db function as there is a type issue with kotlin and setting fields to null

    val clear = ClearContractDestroyedFields()
    clear.setBlockNumber(blockNumberDecimal)
    clear.execute(txCtx.configuration())

    txCtx
      .deleteFrom(Tables.CONTRACT_METADATA)
      .where(Tables.CONTRACT_METADATA.BLOCK_NUMBER.ge(blockNumberDecimal))
      .execute()
  }

  override fun process(txCtx: DSLContext, record: ConsumerRecord<CanonicalKeyRecord, TraceListRecord>) {

    record
      .value()
      .toContractRecords()
      .forEach { dbRecord ->

        if (dbRecord.destroyedAtBlockNumber == null) {

          // creation

          txCtx.insertInto(Tables.CONTRACT)
            .set(dbRecord)
            .execute()

          when (dbRecord.contractType) {
            "ERC20" -> {

              val address = dbRecord.address

              val name = fetchName(address)
              val symbol = fetchSymbol(address)
              val decimals = fetchDecimals(address)
              val totalSupply = fetchTotalSupply(address)

              val metadata = ContractMetadataRecord().apply {
                this.address = address
                this.blockNumber = dbRecord.createdAtBlockNumber
                this.name = name.join()
                this.symbol = symbol.join()
                this.decimals = decimals.join()?.intValueExact()
                this.totalSupply = totalSupply.join()?.toBigDecimal()
              }

              txCtx
                .insertInto(Tables.CONTRACT_METADATA)
                .set(metadata)
                .execute()
            }
            "ERC721" -> {

              val address = dbRecord.address

              val name = fetchName(address)
              val symbol = fetchSymbol(address)

              val metadata = ContractMetadataRecord().apply {
                this.address = address
                this.blockNumber = dbRecord.createdAtBlockNumber
                this.name = name.join()
                this.symbol = symbol.join()
              }

              txCtx
                .insertInto(Tables.CONTRACT_METADATA)
                .set(metadata)
                .execute()
            }
          }
        } else {

          txCtx
            .update(CONTRACT)
            .set(Tables.CONTRACT.DESTROYED_AT_BLOCK_NUMBER, dbRecord.destroyedAtBlockNumber)
            .set(Tables.CONTRACT.DESTROYED_AT_BLOCK_HASH, dbRecord.destroyedAtBlockHash)
            .set(Tables.CONTRACT.DESTROYED_AT_TRANSACTION_HASH, dbRecord.destroyedAtTransactionHash)
            .set(Tables.CONTRACT.DESTROYED_AT_TRACE_ADDRESS, dbRecord.destroyedAtTraceAddress)
            .set(Tables.CONTRACT.DESTROYED_AT_TIMESTAMP, dbRecord.destroyedAtTimestamp)
            .where(Tables.CONTRACT.ADDRESS.eq(dbRecord.address))
            .execute()
        }
      }
  }

  private fun fetchName(contractAddress: String) =
    fetchString(contractAddress, "name")
      .thenApply { str -> str?.substring(0, min(str.length, 64)) } // truncate to 64 characters

  private fun fetchSymbol(contractAddress: String) =
    fetchString(contractAddress, "symbol")
      .thenApply { str -> str?.substring(0, min(str.length, 64)) } // truncate to 64 characters

  private fun fetchString(contractAddress: String, method: String): CompletableFuture<String?> {
    val function = Function(method, emptyList(), listOf(object : TypeReference<Utf8String>() {}))
    val encoded = FunctionEncoder.encode(function)
    return web3.ethCall(
      Transaction.createEthCallTransaction(ETHEREUM_ZERO_ADDRESS, contractAddress, encoded),
      DefaultBlockParameterName.LATEST
    ).sendAsync()
      .thenApply { call ->
        val output = FunctionReturnDecoder.decode(call.value, function.outputParameters)
        cleanString(output.firstOrNull()?.value as String?)
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
    val function = Function("decimals", emptyList(), listOf(object : TypeReference<Uint8>() {}))
    val encoded = FunctionEncoder.encode(function)
    return web3.ethCall(
      Transaction.createEthCallTransaction(ETHEREUM_ZERO_ADDRESS, contractAddress, encoded),
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
    val function = Function("totalSupply", emptyList(), listOf(object : TypeReference<Uint256>() {}))
    val encoded = FunctionEncoder.encode(function)
    return web3.ethCall(
      Transaction.createEthCallTransaction(ETHEREUM_ZERO_ADDRESS, contractAddress, encoded),
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

  private fun cleanString(str: String?) =
    str
      // removes NUL chars
      ?.replace("\u0000", "")
      // removes backslash+u0000
      ?.replace("\\u0000", "")
      // strips off all non-ASCII characters
      ?.replace("[^\\x00-\\x7F]", "")
      // erases all the ASCII control characters
      ?.replace("[\\p{Cntrl}&&[^\r\n\t]]", "")
      // removes non-printable characters from Unicode
      ?.replace("\\p{C}", "")
      ?.trim()
}
