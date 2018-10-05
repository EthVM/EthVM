package io.enkrypt.bolt.utils

import io.enkrypt.bolt.models.ContractType
import org.ethereum.crypto.HashUtil

object StandardTokenDetector {
  fun detect(input: ByteArray): ContractType = ContractType.GENERIC
}

interface TokenDetector {
  fun detect(contract: ByteArray): Boolean
}

/**
 * More information:
 *   - https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 *   - https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/ERC20.sol
 */
class ERC20TokenDetector : TokenDetector {

  val mandatory: Set<FnSignature> = setOf(
    FnSignature("totalSupply()"),
    FnSignature("balanceOf(address)"),
    FnSignature("transfer(address,uint256)"),
    FnSignature("transferFrom(address,address,uint256)"),
    FnSignature("approve(address,uint256)"),
    FnSignature("allowance(address,address)")
  )

  val optional: Set<FnSignature> = setOf(
    FnSignature("name()"),
    FnSignature("symbol()")
  )

  override fun detect(contract: ByteArray): Boolean = false
}

/**
 * More information:
 *   - https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 *   - https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Basic.sol
 * */
class ERC721TokenDetector : TokenDetector {

  val mandatory: Set<FnSignature> = setOf(
    FnSignature("balanceOf(address)"),
    FnSignature("ownerOf(uint256)"),
    FnSignature("transfer(address,uint256)"),
    FnSignature("transferFrom(address,address,uint256)"),
    FnSignature("approve(address,uint256)")
  )

  override fun detect(contract: ByteArray): Boolean = false
}

class FnSignature(fn: String) {

  init {
    assert(fn.isEmpty()) { "Not valid fn name. Must not be null or empty." }
  }

  private val signature by lazy { HashUtil.sha3(fn.toByteArray()).slice(0..4) }

}
