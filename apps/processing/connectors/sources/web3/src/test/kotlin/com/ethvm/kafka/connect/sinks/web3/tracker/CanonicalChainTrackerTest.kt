package com.ethvm.kafka.connect.sinks.web3.tracker

import com.ethvm.kafka.connect.sources.web3.tracker.CanonicalChainTracker
import io.kotlintest.shouldBe
import io.kotlintest.shouldNotBe
import io.kotlintest.specs.BehaviorSpec

class CanonicalChainTrackerTest : BehaviorSpec() {

  init {

    given("a default empty tracker") {

      val tracker = CanonicalChainTracker()

      `when`("we request an initial range") {

        val (range, reOrgs) = tracker.nextRange()

        then("the range should be empty") {
          range shouldBe null
          reOrgs.isEmpty() shouldBe true
        }
      }
    }

    given("a tracker initialised with tail 0 and head 10") {

      val tracker = CanonicalChainTracker(0, 10)

      `when`("we request a range of size 5") {

        val (range, reOrgs) = tracker.nextRange(5)

        then("the range should be from 0..4 inclusively") {

          range shouldNotBe null
          range!!.first shouldBe 0
          range.last shouldBe 4

          reOrgs.isEmpty() shouldBe true
        }
      }

      `when`("we request a second range of size 5") {

        val (range, reOrgs) = tracker.nextRange(5)

        then("the range should be 5..9 inclusively") {

          range shouldNotBe null
          range!!.first shouldBe 5
          range.last shouldBe 9

          reOrgs.isEmpty() shouldBe true
        }
      }

      `when`("we request a third range of size 5") {

        val (range, reOrgs) = tracker.nextRange(5)

        then("the range should be 10..10 inclusively") {

          range shouldNotBe null
          range!!.first shouldBe 10
          range.last shouldBe 10

          reOrgs.isEmpty() shouldBe true
        }
      }
    }
  }
}
