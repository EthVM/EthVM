package io.enkrypt.kafka.streams.models

import io.enkrypt.avro.common.ContractType
import io.enkrypt.avro.common.Data20
import io.enkrypt.avro.common.Data32
import io.enkrypt.avro.processing.ContractCreateRecord
import io.enkrypt.avro.processing.ContractDestructRecord
import io.enkrypt.avro.processing.FungibleTokenTransferRecord
import io.enkrypt.avro.processing.NonFungibleTokenTransferRecord
import java.nio.ByteBuffer

enum class ChainEventType {

  FungibleBalanceTransfer,
  NonFungibleBalanceTransfer,
  ContractCreate,
  ContractDestruct
}

data class ChainEvent(
  val type: ChainEventType,
  val _fungibleTransfer: FungibleTokenTransferRecord? = null,
  val _nonFungibleTransfer: NonFungibleTokenTransferRecord? = null,
  val _contractCreate: ContractCreateRecord? = null,
  val _contractDestruct: ContractDestructRecord? = null
) {

  val fungibleTransfer: FungibleTokenTransferRecord
    get() {
      assert(type == ChainEventType.FungibleBalanceTransfer) { "Type must be FungibleBalanceTransfer" }
      return _fungibleTransfer!!
    }

  val nonFungibleTransfer: NonFungibleTokenTransferRecord
    get() {
      assert(type == ChainEventType.NonFungibleBalanceTransfer) { "Type must be NonFungibleBalanceTransfer" }
      return _nonFungibleTransfer!!
    }

  val contractCreate: ContractCreateRecord
    get() {
      assert(type == ChainEventType.ContractCreate) { "Type must be ContractCreate" }
      return _contractCreate!!
    }

  val contractDestruct: ContractDestructRecord
    get() {
      assert(type == ChainEventType.ContractDestruct) { "Type must be ContractDestruct" }
      return _contractDestruct!!
    }

  fun reverse(reverse: Boolean = true): ChainEvent = when (type) {
    ChainEventType.FungibleBalanceTransfer -> copy(_fungibleTransfer = FungibleTokenTransferRecord.newBuilder(fungibleTransfer).setReverse(reverse).build())
    ChainEventType.NonFungibleBalanceTransfer -> copy(_nonFungibleTransfer = NonFungibleTokenTransferRecord.newBuilder(nonFungibleTransfer).setReverse(reverse).build())
    ChainEventType.ContractCreate -> copy(_contractCreate = ContractCreateRecord.newBuilder(contractCreate).setReverse(reverse).build())
    ChainEventType.ContractDestruct -> copy(_contractDestruct = ContractDestructRecord.newBuilder(contractDestruct).setReverse(reverse).build())
  }

  companion object {

    fun fungibleTransfer(record: FungibleTokenTransferRecord): ChainEvent =
      ChainEvent(ChainEventType.FungibleBalanceTransfer, _fungibleTransfer = record)

    fun fungibleTransfer(
      from: Data20,
      to: Data20,
      amount: ByteBuffer,
      reverse: Boolean = false,
      contract: Data20? = null
    ): ChainEvent =
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
      ChainEvent(ChainEventType.NonFungibleBalanceTransfer, _nonFungibleTransfer = record)

    fun nonFungibleTransfer(
      contract: Data20,
      from: Data20,
      to: Data20,
      tokenId: ByteBuffer,
      reverse: Boolean = false
    ): ChainEvent =
      nonFungibleTransfer(
        NonFungibleTokenTransferRecord.newBuilder()
          .setReverse(reverse)
          .setContract(contract)
          .setFrom(from)
          .setTo(to)
          .setTokenId(tokenId)
          .build()
      )

    fun contractCreate(record: ContractCreateRecord): ChainEvent =
      ChainEvent(ChainEventType.ContractCreate, _contractCreate = record)

    fun contractCreate(
      contractType: ContractType,
      creator: Data20,
      blockHash: Data32,
      txHash: Data32,
      address: Data20,
      data: ByteBuffer,
      reverse: Boolean = false
    ): ChainEvent =
      contractCreate(
        ContractCreateRecord.newBuilder()
          .setReverse(reverse)
          .setType(contractType)
          .setCreator(creator)
          .setBlockHash(blockHash)
          .setTxHash(txHash)
          .setAddress(address)
          .setData(data)
          .build()
      )

    fun contractDestruct(record: ContractDestructRecord): ChainEvent =
      ChainEvent(ChainEventType.ContractDestruct, _contractDestruct = record)

    fun contractDestruct(blockHash: Data32, txHash: Data32, address: Data20, reverse: Boolean = false): ChainEvent =
      contractDestruct(
        ContractDestructRecord.newBuilder()
          .setReverse(reverse)
          .setBlockHash(blockHash)
          .setTxHash(txHash)
          .setAddress(address)
          .build()
      )
  }
}
