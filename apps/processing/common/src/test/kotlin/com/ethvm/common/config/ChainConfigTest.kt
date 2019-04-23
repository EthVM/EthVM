package com.ethvm.common.config

import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec

class ChainConfigTest : BehaviorSpec() {

  init {

    Given("main net config") {

      val netConfig = NetConfig.mainnet

      When("asking for chain config with a block number < 1,150,000") {
        Then("the chain config returned should be Frontier") {
          for (i in 1..1_149_999) {
            (netConfig.chainConfigForBlock(i.toBigInteger()) is FrontierConfig) shouldBe true
          }
        }
      }

      When("asking for chain config with a block number >= 1,150,000 and < 1,192,000") {
        Then("the chain config returned should be Homestead") {
          for (i in 1_150_000..1_191_999) {
            (netConfig.chainConfigForBlock(i.toBigInteger()) is HomesteadConfig) shouldBe true
          }
        }
      }

      When("asking for chain config with a block number >= 1,192,000 and < 2,463,000") {
        Then("the chain config returned should be DaoHardFork") {
          for (i in 1_192_000..2_452_999) {
            (netConfig.chainConfigForBlock(i.toBigInteger()) is DaoHardForkConfig) shouldBe true
          }
        }
      }

      When("asking for chain config with a block number >= 2,453,000 and < 2,675,000") {
        Then("the chain config returned should be Eip150") {
          for (i in 2_453_000..2_674_999) {
            (netConfig.chainConfigForBlock(i.toBigInteger()) is Eip150HardForkConfig) shouldBe true
          }
        }
      }

      When("asking for chain config with a block number >= 2,675,000 and < 4,370,000") {
        Then("the chain config returned should be Eip160") {
          for (i in 2_675_000..4_369_999) {
            (netConfig.chainConfigForBlock(i.toBigInteger()) is Eip160HardForkConfig) shouldBe true
          }
        }
      }

      When("asking for chain config with a block number >= 4,370,000 and < 7,080,000") {
        Then("the chain config returned should be Byzantium") {
          for (i in 4_370_000..7_079_999) {
            (netConfig.chainConfigForBlock(i.toBigInteger()) is ByzantiumConfig) shouldBe true
          }
        }
      }

      When("asking for chain config with a block number >= 7,080,000") {
        Then("the chain config returned should be Constantinople") {
          for (i in 7_080_000..20_000_000) {
            (netConfig.chainConfigForBlock(i.toBigInteger()) is ConstantinopleConfig) shouldBe true
          }
        }
      }
    }

    given("ropsten net config") {

      val netConfig = NetConfig.ropsten

      When("asking for chain config with a block number < 10") {
        Then("the chain config returned should be Homestead") {
          for (i in 1..9) {
            (netConfig.chainConfigForBlock(i.toBigInteger()) is HomesteadConfig) shouldBe true
          }
        }
      }

      When("asking for chain config with a block number >= 10 and < 1,700,000") {
        Then("the chain config returned should be Ropsten and the parent config should be Homestead") {
          for (i in 10..1_699_999) {
            val chainConfig = netConfig.chainConfigForBlock(i.toBigInteger())
            (chainConfig is RopstenConfig) shouldBe true
            (((chainConfig as RopstenConfig)).parent is HomesteadConfig) shouldBe true
          }
        }
      }

      When("asking for chain config with a block number >= 1,700,000 and < 4,230,000") {
        Then("the chain config returned should be Ropsten and the parent config should be Byzantium") {
          for (i in 1_700_000..4_229_999) {
            val chainConfig = netConfig.chainConfigForBlock(i.toBigInteger())
            (chainConfig is RopstenConfig) shouldBe true
            (((chainConfig as RopstenConfig)).parent is ByzantiumConfig) shouldBe true
          }
        }
      }

      When("asking for chain config with a block number >= 4,230,000") {
        Then("the chain config returned should be Ropsten and the parent config should be Constantinople") {
          for (i in 4_230_000..20_000_000) {
            val chainConfig = netConfig.chainConfigForBlock(i.toBigInteger())
            (chainConfig is RopstenConfig) shouldBe true
            (((chainConfig as RopstenConfig)).parent is ConstantinopleConfig) shouldBe true
          }
        }
      }
    }
  }
}
