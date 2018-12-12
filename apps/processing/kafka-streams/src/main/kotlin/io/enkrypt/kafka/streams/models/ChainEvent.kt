package io.enkrypt.kafka.streams.models

import io.enkrypt.avro.common.ContractType
import io.enkrypt.avro.common.Data20
import io.enkrypt.avro.common.Data32
import io.enkrypt.avro.processing.ContractCreationRecord
import io.enkrypt.avro.processing.ContractSuicideRecord
import io.enkrypt.avro.processing.FungibleTokenTransferRecord
import io.enkrypt.avro.processing.NonFungibleTokenTransferRecord
import java.nio.ByteBuffer

enum class ChainEventType {

  FungibleBalanceTransfer,
  NonFungibleBalanceTransfer,
  ContractCreation,
  ContractSuicide
}

class ChainEvent(
  val type: ChainEventType,
  private val _fungibleBalance: FungibleTokenTransferRecord? = null,
  private val _nonFungibleBalance: NonFungibleTokenTransferRecord? = null,
  private val _contractCreation: ContractCreationRecord? = null,
  private val _contractSuicide: ContractSuicideRecord? = null
) {

  val fungibleTransfer: FungibleTokenTransferRecord
    get() {
      assert(type == ChainEventType.FungibleBalanceTransfer) { "Type must be FungibleBalanceTransfer" }
      return _fungibleBalance!!
    }

  val nonFungibleTransfer: NonFungibleTokenTransferRecord
    get() {
      assert(type == ChainEventType.NonFungibleBalanceTransfer) { "Type must be NonFungibleBalanceTransfer" }
      return _nonFungibleBalance!!
    }

  val contractCreation: ContractCreationRecord
    get() {
      assert(type == ChainEventType.ContractCreation) { "Type must be ContractCreation" }
      return _contractCreation!!
    }

  val contractSuicide: ContractSuicideRecord
    get() {
      assert(type == ChainEventType.ContractSuicide) { "Type must be ContractSuicide" }
      return _contractSuicide!!
    }

  companion object {

    fun fungibleTransfer(record: FungibleTokenTransferRecord): ChainEvent =
      ChainEvent(ChainEventType.FungibleBalanceTransfer, _fungibleBalance = record)

    fun fungibleTransfer(from: Data20, to: Data20, amount: ByteBuffer, reverse: Boolean = false, contract: Data20? = null): ChainEvent =
      fungibleTransfer(
        FungibleTokenTransferRecord.newBuilder()
          .setReverse(reverse)
          .setContract(contract)
          .setFrom(from)
          .setTo(to)
          .setAmount(amount)
          .build()
      )

    fun nonFungibleTransfer(record: NonFungibleTokenTransferRecord): ChainEvent =
      ChainEvent(ChainEventType.NonFungibleBalanceTransfer, _nonFungibleBalance = record)

    fun nonFungibleTransfer(contract: Data20, from: Data20, to: Data20, tokenId: ByteBuffer, reverse: Boolean = false): ChainEvent =
      nonFungibleTransfer(
        NonFungibleTokenTransferRecord.newBuilder()
          .setReverse(reverse)
          .setContract(contract)
          .setFrom(from)
          .setTo(to)
          .setTokenId(tokenId)
          .build()
      )

    fun contractCreation(record: ContractCreationRecord): ChainEvent =
      ChainEvent(ChainEventType.ContractCreation, _contractCreation = record)

    fun contractCreation(contractType: ContractType, creator: Data20, blockHash: Data32, txHash: Data32, address: Data20, data: ByteBuffer, reverse: Boolean = false): ChainEvent =
      contractCreation(
        ContractCreationRecord.newBuilder()
          .setReverse(reverse)
          .setType(contractType)
          .setCreator(creator)
          .setBlockHash(blockHash)
          .setTxHash(txHash)
          .setAddress(address)
          .setData(data)
          .build()
      )

    fun contractSuicide(record: ContractSuicideRecord): ChainEvent =
      ChainEvent(ChainEventType.ContractSuicide, _contractSuicide = record)

    fun contractSuicide(blockHash: Data32, txHash: Data32, address: Data20, reverse: Boolean = false): ChainEvent =
      contractSuicide(
        ContractSuicideRecord.newBuilder()
          .setReverse(reverse)
          .setBlockHash(blockHash)
          .setTxHash(txHash)
          .setAddress(address)
          .build()
      )
  }
}
