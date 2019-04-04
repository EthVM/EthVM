import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar

plugins {
  `java-library`
  `maven-publish`
  kotlin("jvm")
  id("com.github.johnrengelman.shadow") version "4.0.3"
  id("org.jlleitschuh.gradle.ktlint")
}

project.java.sourceSets["main"].java {
  srcDir("src/main/kotlin")
}

dependencies {

  // Kotlin
  implementation(kotlin("stdlib"))

  // Modules deps
  implementation(project(":common"))
  implementation(project(":avro"))

  // Kafka
  compileOnly("org.apache.kafka:connect-api:2.2.0")
  implementation("io.confluent:kafka-schema-registry-client:5.2.0")
  implementation("io.confluent:kafka-connect-avro-converter:5.2.0")

  // Mongo
  implementation("org.mongodb:mongodb-driver-sync:3.10.1")

  // Web3
  implementation("org.web3j:parity:4.0.3")

  // Utils
  implementation("com.datamountaineer:kafka-connect-common:1.1.5")
  implementation("joda-time:joda-time:2.10.1")
  implementation("io.arrow-kt:arrow-core:${ext.get("arrow-core-version") as String}")
  implementation("ch.qos.logback:logback-classic:${ext.get("logback-version") as String}")
  implementation("io.github.microutils:kotlin-logging:${ext.get("kotlin-logging-version") as String}")
  implementation("com.beust:klaxon:5.0.1")

  // Tests
  testImplementation("io.kotlintest:kotlintest-runner-junit5:${ext.get("kotlintest-version") as String}")
  testImplementation("io.mockk:mockk:${ext.get("mockk-version") as String}")
  testImplementation("org.apache.kafka:connect-api:2.2.0")
}

project.tasks.getting(Test::class) { useJUnitPlatform {} }

val build: DefaultTask by tasks
build.dependsOn(project.tasks["shadowJar"] as ShadowJar)

tasks.withType<ShadowJar> {
  baseName = project.name
  classifier = ""
}
