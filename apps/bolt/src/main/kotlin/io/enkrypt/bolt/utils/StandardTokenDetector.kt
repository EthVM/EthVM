package io.enkrypt.bolt.utils

import io.enkrypt.bolt.extensions.indexByteArrayOf
import io.enkrypt.bolt.utils.TokenContract.Companion.DECIMALS
import io.enkrypt.bolt.utils.TokenContract.Companion.NAME
import io.enkrypt.bolt.utils.TokenContract.Companion.SYMBOL
import org.ethereum.crypto.HashUtil

/**
 * This object tries to detect ERC20 and ERC721 smart contract tokens by verifying the the signatures in the raw smart contract input.
 *
 * This class is inspired by the work done in Ethereum ETL:
 *   - URL: https://github.com/blockchain-etl/ethereum-etl/blob/master/ethereumetl/service/eth_contract_service.py
 */
object StandardTokenDetector {

  private val detectors: Set<TokenContract> = setOf(
    ERC20TokenContract(),
    ERC721TokenContract()
  )

  fun detect(input: ByteArray): ContractType {
    for (detector in detectors) {
      val result = detector.detect(input)
      if (result == TokenContractMatchResult.COMPLETE_MATCH || result == TokenContractMatchResult.PARTIAL_MATCH) {
        return detector.type
      }
    }

    return ContractType.GENERIC
  }
}

enum class ContractType {
  ERC20,
  ERC721,
  GENERIC
}

interface TokenContract {
  companion object {
    const val NAME = 0
    const val SYMBOL = 1
    const val DECIMALS = 2
  }

  val type: ContractType
  val mandatorySignatures: Set<FnSignature>
  val metadataSignatures: Map<Int, FnSignature>

  fun detect(contract: ByteArray): TokenContractMatchResult {
    val signatures = mandatorySignatures
    val mandatorySignaturesSize = signatures.size

    var matches = 0

    for (s in signatures) {
      val indexOf = contract.indexByteArrayOf(s.signature)
      if (indexOf > 0) {
        matches++
      }
    }

    // Full match when everything is according to the spec
    if (matches == mandatorySignaturesSize) {
      return TokenContractMatchResult.COMPLETE_MATCH
    }

    // Otherwise, we may have doubts, but we don't loose anything for trying to retrieve more information
    return if (matches > mandatorySignaturesSize / 2) {
      TokenContractMatchResult.PARTIAL_MATCH
    } else {
      TokenContractMatchResult.NONE_MATCH
    }
  }
}

/**
 * More information:
 *   - https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 *   - https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/ERC20.sol
 */
class ERC20TokenContract : TokenContract {

  override val type: ContractType = ContractType.ERC20

  override val mandatorySignatures: Set<FnSignature> = setOf(
    FnSignature("totalSupply()"),
    FnSignature("balanceOf(address)"),
    FnSignature("transfer(address,uint256)"),
    FnSignature("transferFrom(address,address,uint256)"),
    FnSignature("approve(address,uint256)"),
    FnSignature("allowance(address,address)")
  )

  override val metadataSignatures: Map<Int, FnSignature> = mapOf(
    NAME to FnSignature("name()"),
    SYMBOL to FnSignature("symbol()"),
    DECIMALS to FnSignature("decimals()")
  )
}

/**
 * More information:
 *   - https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 *   - https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Basic.sol
 * */
class ERC721TokenContract : TokenContract {

  override val type: ContractType = ContractType.ERC721

  override val mandatorySignatures: Set<FnSignature> = setOf(
    FnSignature("balanceOf(address)"),
    FnSignature("ownerOf(uint256)"),
    FnSignature("transfer(address,uint256)"),
    FnSignature("transferFrom(address,address,uint256)"),
    FnSignature("approve(address,uint256)")
  )

  override val metadataSignatures: Map<Int, FnSignature> = mapOf(
    NAME to FnSignature("name()"),
    SYMBOL to FnSignature("symbol()"),
    DECIMALS to FnSignature("decimals()")
  )
}

enum class TokenContractMatchResult {
  /**
   * Raw smart contract matches all of the mandatory signatures (so we can confirm that is 100% standard token).
   */
  COMPLETE_MATCH,

  /**
   * Raw smart contract partially matches some of the required mandatory signatures (above 50%).
   *
   * With this we can't say that the token is a standard one, but at least we know that implements part of it.
   */
  PARTIAL_MATCH,

  /**
   * None of the required methods matches the mandatory signatures
   */
  NONE_MATCH
}

class FnSignature(fn: String) {

  init {
    assert(fn.isEmpty()) { "Not valid fn name. Must not be null or empty." }
  }

  val signature by lazy { HashUtil.sha3(fn.toByteArray()).slice(0..4).toByteArray() }

}
