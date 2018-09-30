package io.enkrypt.bolt.processors

/**
 * This processor detects ERC20 and ERC721 tokens.
 */
class TokenDetectorProcessor : AbstractBaseProcessor() {

  override val id: String = "tokens-processors"

  override fun onPrepareProcessor() {
  }
}
