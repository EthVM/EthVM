package io.enkrypt.bolt.kafka.serdes

object BoltSerdes {

  fun Date() = DateSerde()

  fun BigInteger() = BigIntegerSerde()

  fun Long() = LongSerde()

  fun AccountState() = AccountStateSerde()

  fun BlockStatistics() = BlockStatisticsSerde()

  fun BlockSummary() = BlockSummarySerde()

  fun Transaction() = TransactionSerde()

  fun TokenTransferKey() = TokenTransferKeySerde()

  fun TokenTransfer() = TokenTransferSerde()

  fun Address() = AddressSerde()

}
