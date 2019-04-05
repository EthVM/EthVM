plugins {
  application
  kotlin("jvm")
  id("org.jlleitschuh.gradle.ktlint")
}

val test by tasks.getting(Test::class) { useJUnitPlatform {} }

application {
  mainClassName = "com.ethvm.kafka.streams.MainKt"
}

project.java.sourceSets["main"].java {
  srcDir("src/main/kotlin")
}

dependencies {
  // Kotlin
  implementation(kotlin("stdlib"))

  // Avro
  implementation(project(":common"))
  implementation(project(":avro"))

  // Ethereumj
  implementation("org.ethereum:ethereumj-core:${ext.get("ethereumj-version") as String}")

  // Kafka
  implementation("org.apache.kafka:kafka-streams:2.1.1")
  implementation("io.confluent:kafka-streams-avro-serde:5.1.0")

  // Utils
  implementation("com.github.ajalt:clikt:1.7.0")
  implementation("ch.qos.logback:logback-classic:${ext.get("logback-version") as String}")
  implementation("io.github.microutils:kotlin-logging:${ext.get("kotlin-logging-version") as String}")
  implementation("org.koin:koin-core:1.0.2")
  implementation("io.arrow-kt:arrow-core:${ext.get("arrow-core-version") as String}")

  // Testing
  testImplementation("io.kotlintest:kotlintest-runner-junit5:${ext.get("kotlintest-version") as String}")
  testImplementation("io.mockk:mockk:${ext.get("mockk-version") as String}")
  testImplementation("org.apache.kafka:kafka-streams-test-utils:2.1.0")
}
