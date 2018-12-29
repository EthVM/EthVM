import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  application
  kotlin("jvm")
  id("org.jlleitschuh.gradle.ktlint")
}

val test by tasks.getting(Test::class) { useJUnitPlatform {} }

application {
  mainClassName = "io.enkrypt.kafka.streams.MainKt"
}

project.java.sourceSets["main"].java {
  srcDir("src/main/kotlin")
}

dependencies {
  // Kotlin
  implementation(kotlin("stdlib"))
  implementation(kotlin("reflect"))

  // Avro
  implementation(project(":common"))
  implementation(project(":avro"))

  // Ethereumj
  implementation(group = "io.enkrypt", name = "ethereumj-core", version = "1.10.0.0-SNAPSHOT")

  // Kafka
  implementation("org.apache.kafka:kafka-streams:2.1.0")
  implementation("io.confluent:kafka-streams-avro-serde:5.0.1")

  // Utils
  implementation("com.github.ajalt:clikt:1.5.0")
  implementation("ch.qos.logback:logback-classic:1.2.3")
  implementation("io.github.microutils:kotlin-logging:1.6.10")
  implementation("joda-time:joda-time:2.10")
  implementation("org.koin:koin-core:1.0.2")
  implementation("io.arrow-kt:arrow-core:0.8.1")

  // Testing
  testImplementation("org.apache.kafka:kafka-streams-test-utils:2.1.0")
  testImplementation("org.koin:koin-test:1.0.2")
  testImplementation("io.kotlintest:kotlintest-runner-junit5:3.1.11")
  testImplementation("io.mockk:mockk:1.8.13")
}
