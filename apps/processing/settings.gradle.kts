pluginManagement {

  repositories {
    gradlePluginPortal()
    jcenter()
    maven("https://dl.bintray.com/gradle/gradle-plugins")
  }

}

include(
  ":avro",
  ":common",
  ":kafka-streams",
  ":connectors:sinks:jdbc",
  ":connectors:sources:exchanges",
  ":connectors:sources:eth-tokens-list",
  ":connectors:sources:web3"
)
