package com.ethvm.kafka.streams.utils

import com.ethvm.avro.common.ContractType
import com.ethvm.common.extensions.byteArray
import com.ethvm.common.extensions.indexByteArrayOf
import com.ethvm.kafka.streams.utils.TokenContract.Companion.DECIMALS
import com.ethvm.kafka.streams.utils.TokenContract.Companion.NAME
import com.ethvm.kafka.streams.utils.TokenContract.Companion.SYMBOL
import com.ethvm.kafka.streams.utils.TokenContract.Companion.TOTAL_SUPPLY
import org.web3j.crypto.Hash
import java.nio.ByteBuffer

/**
 * This object tries to detect ERC20 and ERC721 smart contract tokens by verifying the signatures in the raw smart contract input.
 *
 * This class is inspired by the work done in Ethereum ETL:
 *   - URL: https://github.com/blockchain-etl/ethereum-etl/blob/master/ethereumetl/service/eth_contract_service.py
 */
object StandardTokenDetector {

  private val detectors: Set<TokenContract> = setOf(
    ERC20TokenContract(),
    ERC721TokenContract(),
    CryptoKittiesTokenContract()
  )

  fun detect(input: ByteBuffer): Pair<ContractType, TokenContractMatchResult> = detect(input.byteArray()!!)

  fun detect(input: ByteArray): Pair<ContractType, TokenContractMatchResult> {
    for (detector in detectors) {
      val result = detector.detect(input)
      if (result == TokenContractMatchResult.COMPLETE_MATCH) {
        return Pair(detector.type, result)
      }
    }

    return Pair(ContractType.GENERIC, TokenContractMatchResult.NONE_MATCH)
  }
}

interface TokenContract {

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

    return if (matches == mandatorySignaturesSize) {
      TokenContractMatchResult.COMPLETE_MATCH
    } else {
      TokenContractMatchResult.NONE_MATCH
    }
  }

  // Common metadata keys
  companion object {
    const val NAME = 0
    const val SYMBOL = 1
    const val DECIMALS = 2
    const val TOTAL_SUPPLY = 3
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
 *   - https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/IERC721.sol
 * */
open class ERC721TokenContract : TokenContract {

  override val type: ContractType = ContractType.ERC721

  override val mandatorySignatures: Set<FnSignature> = setOf(
    FnSignature("balanceOf(address)"),
    FnSignature("ownerOf(uint256)"),
    FnSignature("safeTransferFrom(address,address,uint256,bytes)"),
    FnSignature("safeTransferFrom(address,address,uint256)"),
    FnSignature("transferFrom(address,address,uint256)"),
    FnSignature("approve(address,uint256)"),
    FnSignature("setApprovalForAll(address,bool)"),
    FnSignature("getApproved(uint256)"),
    FnSignature("isApprovedForAll(address,address)")
  )

  override val metadataSignatures: Map<Int, FnSignature> = mapOf(
    NAME to FnSignature("name()"),
    SYMBOL to FnSignature("symbol()"),
    URI to FnSignature("tokenURI(uint256)"),
    TOTAL_SUPPLY to FnSignature("totalSupply()")
  )

  companion object {
    const val URI = 100
  }
}

class CryptoKittiesTokenContract : ERC721TokenContract() {

  override val mandatorySignatures: Set<FnSignature> = setOf(
    FnSignature("totalSupply()"),
    FnSignature("balanceOf(address)"),
    FnSignature("ownerOf(uint256)"),
    FnSignature("approve(address,uint256)"),
    FnSignature("transfer(address,uint256)"),
    FnSignature("transferFrom(address,address,uint256)")
  )

  override val metadataSignatures: Map<Int, FnSignature> = mapOf(
    NAME to FnSignature("name()"),
    SYMBOL to FnSignature("symbol()"),
    TOKENS_OF_OWNER to FnSignature("tokensOfOwner(address)"),
    TOKEN_METADATA to FnSignature("tokenMetadata(uint256,string)")
  )

  companion object {
    const val TOKENS_OF_OWNER = 200
    const val TOKEN_METADATA = 201
  }
}

enum class TokenContractMatchResult {
  /**
   * Raw smart contract matches all of the mandatory signatures (so we can confirm that is 100% standard token).
   */
  COMPLETE_MATCH,

  /**
   * None of the required methods matches the mandatory signatures.
   */
  NONE_MATCH
}

class FnSignature(val fn: String) {

  init {
    assert(fn.isNotEmpty()) { "Not valid fn name. Must not be null or empty." }
  }

  val signature by lazy { Hash.sha3(fn.toByteArray()).slice(0..3).toByteArray() }
}
