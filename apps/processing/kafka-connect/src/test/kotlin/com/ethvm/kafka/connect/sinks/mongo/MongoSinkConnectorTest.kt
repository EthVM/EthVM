package com.ethvm.kafka.connect.sinks.mongo

import io.kotlintest.matchers.collections.shouldContain
import io.kotlintest.shouldBe
import io.kotlintest.shouldNotBe
import io.kotlintest.shouldThrow
import io.kotlintest.specs.BehaviorSpec
import java.lang.IllegalArgumentException

class MongoSinkConnectorTest : BehaviorSpec() {

  init {
    given("a MongoSinkConnector instance") {

      val sink = com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector()

      `when`("we ask for its version number") {

        val version = sink.version()

        then("we obtain a concrete value") {
          version shouldNotBe null
        }
      }

      `when`("we ask to return its task class") {

        val clazz = sink.taskClass()

        then("we obtain a MongoSinkTask class value") {
          clazz shouldBe com.ethvm.kafka.connect.sinks.mongo.MongoSinkTask::class.java
        }
      }

      `when`("we ask to return its default task configurations") {

        val taskConfigs = sink.taskConfigs(2)

        then("we obtain a default list of configs") {
          taskConfigs.size shouldBe 2
          taskConfigs[0].size shouldBe 0
        }
      }

      `when`("we ask to return its task configuration after starting") {

        sink.start(mutableMapOf("test" to "result"))
        val taskConfigs = sink.taskConfigs(2)

        then("we obtain a default list of configs") {
          taskConfigs.size shouldBe 2
          taskConfigs[0]["test"] shouldBe "result"
        }
      }

      `when`("we ask to return its config") {

        val config = sink.config()

        then("we obtain a default config object") {
          config shouldNotBe null
          config.names() shouldContain com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector.Config.MONGO_URI_CONFIG
          config.defaultValues().values shouldContain com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector.Config.MONGO_DEFAULT_URI_VALUE
        }
      }
    }

    given("a MongoSinkConnector.Config object") {

      `when`("we ask to return a mongo URI with an empty map") {

        val mongoUri = com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector.Config.mongoUri(mutableMapOf())

        then("we obtain a correct parsed MongoURI object with default value") {
          mongoUri shouldNotBe null
          mongoUri shouldBe com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector.Config.MONGO_DEFAULT_URI_VALUE
        }
      }

      `when`("we ask to return a mongo URI with a map containing an URI") {

        val mongoUri = com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector.Config.mongoUri(
          mutableMapOf(com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector.Config.MONGO_URI_CONFIG to "mongodb://localhost:27017/test")
        )

        then("we obtain a correct parsed MongoURI object with the passed URI") {
          mongoUri shouldNotBe null
          mongoUri shouldBe "mongodb://localhost:27017/test"
        }
      }

      `when`("we ask to return a mongo URI with a map containing a bad URI") {

        val exception = shouldThrow<IllegalArgumentException> {
          com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector.Config.mongoUri(
            mutableMapOf(com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector.Config.MONGO_URI_CONFIG to "mongodb://localhost:27017/")
          )
        }

        then("we obtain an IllegalArgumentException") {
          exception.message shouldBe "Mongo URI does not contain a database name!"
        }
      }
    }
  }
}
