plugins {
  application
  kotlin("jvm")
  id("org.jlleitschuh.gradle.ktlint")
}

val test by tasks.getting(Test::class) { useJUnitPlatform {} }

application {
  mainClassName = "com.ethvm.kafka.streams.MainKt"
  applicationDefaultJvmArgs = listOf("-Dxms=2g", "-Dxmx=2g")
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

  implementation("joda-time:joda-time:2.10.1")

  // Ethereumj
  implementation("org.ethereum:ethereumj-core:${ext.get("ethereumj-version") as String}") {
    exclude("org.ethereum", "rocksdbjni")
    exclude("org.ethereum", "leveldbjni-all")
  }

  // Web3
  implementation("org.web3j:parity:4.2.0")

  // Kafka
  implementation("org.apache.kafka:kafka-streams:2.1.1")
  implementation("io.confluent:kafka-schema-registry-client:5.1.0")
  implementation("io.confluent:kafka-streams-avro-serde:5.1.0")

  // Utils
  implementation("com.github.ajalt:clikt:1.7.0")
  implementation("ch.qos.logback:logback-classic:${ext.get("logback-version") as String}")

  implementation("io.github.microutils:kotlin-logging:${ext.get("kotlin-logging-version") as String}") {
    // version conflict
    exclude("org.jetbrains.kotlin", "kotlin-stdlib-common")
  }

  implementation("org.koin:koin-core:2.0.0-rc-2")

  implementation("io.arrow-kt:arrow-core:${ext.get("arrow-core-version") as String}") {
    // version conflict
    exclude("org.jetbrains.kotlin", "kotlin-stdlib-common")
    exclude("org.jetbrains.kotlin", "kotlin-stdlib-jdk7")
  }

  // Testing
  testImplementation("io.kotlintest:kotlintest-runner-junit5:${ext.get("kotlintest-version") as String}")
  testImplementation("io.mockk:mockk:${ext.get("mockk-version") as String}")
  testImplementation("org.apache.kafka:kafka-streams-test-utils:${ext.get("kafka-connect-api-version") as String}")
}
