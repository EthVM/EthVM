plugins {
  application
  kotlin("jvm") version "1.2.61"
}

repositories {
  jcenter()
  mavenCentral()
  maven("https://jitpack.io")
  maven("https://packages.confluent.io/maven/")
}

application {
  mainClassName = "io.enkrypt.bolt.MainKt"
}

dependencies {
  compile(kotlin("stdlib"))

  // Kafka
  compile("org.apache.kafka:kafka-streams:2.0.0")
  compile("io.confluent:kafka-streams-avro-serde:5.0.0")
  compile("org.apache.avro:avro:1.8.2")

  // Utils
  compile("com.github.ajalt:clikt:1.4.0")
  compile("org.slf4j:slf4j-log4j12:1.7.25")
  compile("io.github.microutils:kotlin-logging:1.5.9")
  compile("joda-time:joda-time:2.10")
}
