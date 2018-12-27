package io.enkrypt.util

import org.ethereum.core.CallTransaction
import org.ethereum.crypto.ECKey
import org.ethereum.crypto.HashUtil
import org.ethereum.solidity.compiler.CompilationResult
import org.ethereum.solidity.compiler.SolidityCompiler
import org.ethereum.util.ByteUtil
import org.ethereum.util.ByteUtil.longToBytesNoLeadZeroes
import org.ethereum.util.blockchain.SolidityFunction
import org.spongycastle.util.encoders.Hex

enum class TestContracts(path: String) {

  ERC20("/solidity/erc20.sol"),
  ERC721("/solidity/erc721.sol"),
  GLUTTONY("/solidity/Gluttony.sol"),
  MULTI_SIG_TWO_OF_THREE("/solidity/MultiSig2of3.sol"),
  SELF_DESTRUCTS("/solidity/SelfDestructs.sol"),
  PING_PONG("/solidity/PingPong.sol");

  val src = TestContracts::class.java.getResource(path).readText()

  val cres = {
    val res = SolidityCompiler.compile(
      src.toByteArray(),
      true,
      SolidityCompiler.Options.ABI,
      SolidityCompiler.Options.BIN
    )
    if (res.isFailed) throw Exception("Failed to compile: " + res.errors)

    CompilationResult.parse(res.output)
  }()

  fun binaryFor(name: String) = cres.getContract(name).bin!!

  fun abiFor(name: String) = cres.getContract(name).abi!!

  fun contractFor(name: String) = SolidityContract(name, this)
}

class SolidityContract(abi: String, val bin: String) {

  private val contract = CallTransaction.Contract(abi)
  private val constructor: CallTransaction.Function? = contract.constructor

  constructor(name: String, contract: TestContracts) : this(contract.abiFor(name), contract.binaryFor(name))

  fun construct(vararg args: Any): ByteArray {

    if (constructor == null && args.isNotEmpty()) {
      throw Exception("No constructor with args found")
    }

    val argsEncoded = when (constructor) {
      null -> ByteArray(0)
      else -> constructor.encodeArguments(*args)
    }

    return ByteUtil.merge(Hex.decode(bin), argsEncoded)
  }

  fun callFunction(functionName: String, vararg args: Any): ByteArray {
    val function = contract.getByName(functionName)
    return function.encode(*convertArgs(*args))
  }

  private fun convertArgs(vararg args: Any) =
    args.map {
      when (it) {
        is SolidityFunction -> ByteUtil.merge(it.contract.address, it.`interface`.encodeSignature())
        else -> it
      }
    }.toTypedArray()

  companion object {

    fun contractAddress(sender: ECKey, nonce: Long): ByteArray = contractAddress(sender.address, nonce)

    fun contractAddress(sender: ECKey, nonce: ByteArray): ByteArray = contractAddress(sender.address, nonce)

    fun contractAddress(sender: ByteArray, nonce: Long): ByteArray = contractAddress(sender, longToBytesNoLeadZeroes(nonce))

    fun contractAddress(sender: ByteArray, nonce: ByteArray): ByteArray = HashUtil.calcNewAddr(sender, nonce)
  }
}
