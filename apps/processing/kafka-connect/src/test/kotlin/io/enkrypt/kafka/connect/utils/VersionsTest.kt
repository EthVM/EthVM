package io.enkrypt.kafka.connect.utils

import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec

class VersionsTest : BehaviorSpec() {

  init {
    given("a version properties file") {

      `when`("we read the version from an existing file") {

        val version = Versions.of("/test-version.properties")

        then("we should obtain the value") {
          version shouldBe "0.1.0"
        }
      }

      `when`("we try to read the version from a non existing file") {

        val version = Versions.of("/non-existing-file.properties")

        then("we should obtain unknown value") {
          version shouldBe "unknown"
        }
      }
    }
  }
}
