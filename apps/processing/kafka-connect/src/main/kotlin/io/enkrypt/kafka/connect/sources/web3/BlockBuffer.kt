package io.enkrypt.kafka.connect.sources.web3

import java.math.BigInteger
import java.util.SortedMap

class BlockBuffer(private val size: Int) {

  private var blocksByNumber = sortedMapOf<BigInteger, BlockData>()
  private var blocksByHash = mapOf<String, BlockData>()

  fun add(data: BlockData) {

    val block = data.block

    // index by number and hash
    blocksByNumber[block.number] = data
    blocksByHash = blocksByHash + (block.hash to data)

    if(blocksByNumber.size > size) {

      // remove earliest numbered block if we have reached the buffer size

      val removed = blocksByNumber.remove(blocksByNumber.firstKey())
      blocksByHash = blocksByHash - removed!!.block.hash
    }

  }

  fun size() = blocksByNumber.size

  fun earliestNumber() = blocksByNumber.firstKey()

  operator fun get(number: BigInteger): BlockData? = blocksByNumber[number]

  operator fun get(hash: String): BlockData? = blocksByHash[hash]

}
