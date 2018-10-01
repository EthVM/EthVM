package io.enkrypt.bolt.processors

import io.enkrypt.bolt.extensions.toHex
import org.ethereum.crypto.HashUtil

/**
 * This processor detects ERC20 and ERC721 tokens.
 *
 * In order for this to work properly, we need that getContractStorage from ContractDetails in EthereumJ is available.
 *
 * URL: https://github.com/ethereum/ethereumj/blob/a03131f66dd68dac27be04ad453d7b278878b557/ethereumj-core/src/main/java/org/ethereum/core/TransactionExecutor.java#L422
 */
class TokenDetectorProcessor : AbstractBaseProcessor() {

  override val id: String = "tokens-detector-processors"

  override fun onPrepareProcessor() {
  }
}

class TokenDetectorFactory {
  fun create(): Set<TokenDetector> = emptySet()
}

interface TokenDetector {
  fun detect(input: ByteArray): Boolean
}

/**
 * More information:
 *   - https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 *   - https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/ERC20.sol
 */
class ERC20TokenDetector : TokenDetector {

  val mandatory: Set<Signature> = setOf(
    Signature("totalSupply()"),
    Signature("balanceOf(address)"),
    Signature("transfer(address,uint256)"),
    Signature("transferFrom(address,address,uint256)"),
    Signature("approve(address,uint256)"),
    Signature("allowance(address,address)")
  )

  val optional: Set<Signature> = setOf(
    Signature("name()"),
    Signature("symbol()")
  )

  override fun detect(input: ByteArray): Boolean {
    return false
  }
}

/**
 * More information:
 *   - https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 *   - https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Basic.sol
 * */
class ERC721TokenDetector : TokenDetector {

  val mandatory: Set<Signature> = setOf(
    Signature("balanceOf(address)"),
    Signature("ownerOf(uint256)"),
    Signature("transfer(address,uint256)"),
    Signature("transferFrom(address,address,uint256)"),
    Signature("approve(address,uint256)")
  )

  override fun detect(input: ByteArray): Boolean {
    return false
  }
}

class Signature(val fn: String) {

  init {
    assert(fn.isEmpty()) { "Not valid fn name. Must not be null or empty." }
  }

  private val signature by lazy { HashUtil.sha3(fn.toByteArray()).toHex()?.substring(0, 8) }

}
