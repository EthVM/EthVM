import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  application
  kotlin("jvm") version "1.2.61"
}

tasks.withType<KotlinCompile> {
  kotlinOptions.jvmTarget = "1.8"
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

project.java.sourceSets["main"].java {
  srcDir("src/main/kotlin")
}

dependencies {
  compile(kotlin("stdlib"))

  // Kafka
  compile("org.apache.kafka:kafka-streams:2.0.0")
  compile("io.confluent:kafka-streams-avro-serde:5.0.0")
  compile("org.apache.avro:avro:1.8.2")

  // mongo
  compile("org.litote.kmongo:kmongo:3.8.2")

  // Utils
  compile("com.github.ajalt:clikt:1.4.0")
  compile("org.slf4j:slf4j-log4j12:1.7.25")
  compile("io.github.microutils:kotlin-logging:1.5.9")
  compile("joda-time:joda-time:2.10")
  compile("org.koin:koin-core:1.0.0-RC-2")
  compile("org.web3j:utils:3.5.0")

  testCompile("org.koin:koin-test:1.0.0-RC-2")
}
