package com.ethvm.processing.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.common.extensions.hexBytes
import com.ethvm.db.Tables
import com.ethvm.db.Tables.CONTRACT
import com.ethvm.db.Tables.CONTRACT_METADATA
import com.ethvm.db.routines.ClearContractDestroyedFields
import com.ethvm.db.tables.records.ContractMetadataRecord
import com.ethvm.processing.StandardTokenDetector
import com.ethvm.processing.extensions.toContractRecords
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
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
import java.util.Properties
import java.util.concurrent.CompletableFuture
import kotlin.math.min

class ContractLifecycleProcessor : AbstractProcessor<TraceListRecord>("contract-lifecycle-processor") {

  private val ETHEREUM_ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

  override val logger = KotlinLogging.logger {}

  override val kafkaProps: Properties = Properties()
    .apply {
      put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 16)
    }

  private val topicTraces: String by inject(named("topicTraces"))

  private val web3: Web3j by inject()

  override val topics = listOf(topicTraces)

  override fun initialise(txCtx: DSLContext, latestSyncBlock: BigInteger?) {}

  override fun blockHashFor(value: TraceListRecord) = value.blockHash

  override fun reset(txCtx: DSLContext) {
    txCtx
      .truncate(CONTRACT)
      .execute()

    txCtx
      .truncate(CONTRACT_METADATA)
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

          txCtx.insertInto(CONTRACT)
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
                .insertInto(CONTRACT_METADATA)
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
                .insertInto(CONTRACT_METADATA)
                .set(metadata)
                .execute()

            }
          }
        } else {

          txCtx
            .update(CONTRACT)
            .set(CONTRACT.DESTROYED_AT_BLOCK_NUMBER, dbRecord.destroyedAtBlockNumber)
            .set(CONTRACT.DESTROYED_AT_BLOCK_HASH, dbRecord.destroyedAtBlockHash)
            .set(CONTRACT.DESTROYED_AT_TRANSACTION_HASH, dbRecord.destroyedAtTransactionHash)
            .set(CONTRACT.DESTROYED_AT_TRACE_ADDRESS, dbRecord.destroyedAtTraceAddress)
            .set(CONTRACT.DESTROYED_AT_TIMESTAMP, dbRecord.destroyedAtTimestamp)
            .where(CONTRACT.ADDRESS.eq(dbRecord.address))
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

fun main(args: Array<String>) {
  
  val contractCode = "6060604052341561000f57600080fd5b604051610c97380380610c97833981016040528080518201919060200180518201919060200180519190602001805191906020018051919060200180519190602001805160068054600160a060020a033316600160a060020a031991821681179092556007805490911690911790559150600590508780516100959291602001906100ee565b5060028680516100a99291602001906100ee565b5060018054600160a060020a03968716600160a060020a0319918216179091556000805495909616941693909317909355600855600991909155600455506101899050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061012f57805160ff191683800117855561015c565b8280016001018555821561015c579182015b8281111561015c578251825591602001919060010190610141565b5061016892915061016c565b5090565b61018691905b808211156101685760008155600101610172565b90565b610aff806101986000396000f3006060604052600436106100e25763ffffffff60e060020a60003504166306661abd81146100e75780630ad9d0521461010c57806313af40351461019657806313faede6146101b757806314f1586a146101ca5780633fc8cef3146101dd57806340b2f5b51461020c578063457f4d411461021f578063474ce872146102325780634dc415de1461024557806365372147146102585780637022b58e1461026b57806383197ef01461027e5780638da5cb5b14610291578063944dc9fe146102a4578063c2d8de5414610309578063d31fdffd1461031c578063ddca3f431461033b575b600080fd5b34156100f257600080fd5b6100fa61034e565b60405190815260200160405180910390f35b341561011757600080fd5b61011f610354565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561015b578082015183820152602001610143565b50505050905090810190601f1680156101885780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156101a157600080fd5b6101b5600160a060020a03600435166103f2565b005b34156101c257600080fd5b6100fa61043c565b34156101d557600080fd5b61011f610442565b34156101e857600080fd5b6101f06104ad565b604051600160a060020a03909116815260200160405180910390f35b341561021757600080fd5b6101f06104c5565b341561022a57600080fd5b6101f06104dd565b341561023d57600080fd5b6101f06104ec565b341561025057600080fd5b6101b56104fb565b341561026357600080fd5b61011f6105de565b341561027657600080fd5b6101b5610649565b341561028957600080fd5b6101b561072c565b341561029c57600080fd5b6101f0610753565b34156102af57600080fd5b6102f560046024813581810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284375094965061076295505050505050565b604051901515815260200160405180910390f35b341561031457600080fd5b6101f06108a2565b341561032757600080fd5b6101b5600160a060020a03600435166108b1565b341561034657600080fd5b6100fa6108fb565b60095481565b60058054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103ea5780601f106103bf576101008083540402835291602001916103ea565b820191906000526020600020905b8154815290600101906020018083116103cd57829003601f168201915b505050505081565b60065433600160a060020a0390811691161461040d57600080fd5b6006805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b60085481565b60028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103ea5780601f106103bf576101008083540402835291602001916103ea565b73c00fd9820cd2898cc4c054b7bf142de637ad129a81565b735df531240f97049ee8d28a8e51030a3b5a8e8ce481565b600754600160a060020a031681565b600154600160a060020a031681565b61050433610901565b151561050f57600080fd5b735df531240f97049ee8d28a8e51030a3b5a8e8ce4600160a060020a031663a9059cbb3360045460006040516020015260405160e060020a63ffffffff8516028152600160a060020a0390921660048301526024820152604401602060405180830381600087803b151561058257600080fd5b6102c65a03f1151561059357600080fd5b5050506040518051905015156105a857600080fd5b6105b0610913565b7fefde6dcf3c2196c5705e848c09f0659d33de3ca0248be3ab40852d1bafc0f1e360405160405180910390a1565b60038054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103ea5780601f106103bf576101008083540402835291602001916103ea565b61065233610901565b151561065d57600080fd5b735df531240f97049ee8d28a8e51030a3b5a8e8ce4600160a060020a031663a9059cbb3360045460006040516020015260405160e060020a63ffffffff8516028152600160a060020a0390921660048301526024820152604401602060405180830381600087803b15156106d057600080fd5b6102c65a03f115156106e157600080fd5b5050506040518051905015156106f657600080fd5b6106fe6109b9565b7f1e393d8f648e647a6dfadc3679e705971550b75e5c722b193a5bae02151894c160405160405180910390a1565b60075433600160a060020a0390811691161461074757600080fd5b33600160a060020a0316ff5b600654600160a060020a031681565b6000805433600160a060020a0390811691161461077e57600080fd5b6002805460006000196101006001841615020190911691909104116107a257600080fd5b60035460026000196101006001841615020190911604156107c257600080fd5b7f5ab64fb87e623978177884a091a88f5cf71a28fe2bf49ed1dc74330de1b263388260405160208082528190810183818151815260200191508051906020019080838360005b83811015610820578082015183820152602001610808565b50505050905090810190601f16801561084d5780820380516001836020036101000a031916815260200191505b509250505060405180910390a1600382805161086d929160200190610a38565b507ffef93d35ff6e4802e2beec09e38b9cd6eeea4918fe86d3a02cfd34a18dace1de60405160405180910390a1506001919050565b600054600160a060020a031681565b60075433600160a060020a039081169116146108cc57600080fd5b6007805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b60045481565b41600160a060020a0390811691161490565b60015460095460085473c00fd9820cd2898cc4c054b7bf142de637ad129a9263a9059cbb92600160a060020a03909116910260006040516020015260405160e060020a63ffffffff8516028152600160a060020a0390921660048301526024820152604401602060405180830381600087803b151561099157600080fd5b6102c65a03f115156109a257600080fd5b5050506040518051905015156109b757600080fd5b565b6000805460095460085473c00fd9820cd2898cc4c054b7bf142de637ad129a9363a9059cbb93600160a060020a03169291909102906040516020015260405160e060020a63ffffffff8516028152600160a060020a0390921660048301526024820152604401602060405180830381600087803b151561099157600080fd5b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610a7957805160ff1916838001178555610aa6565b82800160010185558215610aa6579182015b82811115610aa6578251825591602001919060010190610a8b565b50610ab2929150610ab6565b5090565b610ad091905b80821115610ab25760008155600101610abc565b905600a165627a7a723058202bf6257e56351592fe8a5ea2913ed793feb60fc7c6c365f77547c27981ae9932002900000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000a5939149bf20d57d665112cdfa9b87a86f7572900000000000000000000000027eddd316c8a9bfed82e7d271c87922abb0c153c000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002212207abedce68733427074ef3a776e426deb297a8b8b3704b47bce64e4be4e0b4f7d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002212207abedce68733427074ef3a776e426deb297a8b8b3704b47bce64e4be4e0b4f7d000000000000000000000000000000000000000000000000000000000000"

  val (contractType, tokenContractMatchResult) = StandardTokenDetector.detect(contractCode.hexBytes())

  println("Result = $contractType, $tokenContractMatchResult")

}
