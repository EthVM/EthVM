package io.enkrypt.util

import org.ethereum.solidity.compiler.CompilationResult
import org.ethereum.solidity.compiler.SolidityCompiler

enum class TestContractSource(path: String) {

  ERC20("/solidity/erc20.sol"),
  ERC721("/solidity/erc721.sol"),
  GLUTTONY("/solidity/gluttony.sol"),
  MULTI_SIG_TWO_OF_THREE("/solidity/MultiSig2of3.sol");

  val src = TestContractSource::class.java.getResource(path).readText()

  val compiled = {
    val res = SolidityCompiler.compile(
      src.toByteArray(),
      true,
      SolidityCompiler.Options.ABI,
      SolidityCompiler.Options.BIN
    )
    CompilationResult.parse(res.output)
  }



}


object TestContracts {



}
