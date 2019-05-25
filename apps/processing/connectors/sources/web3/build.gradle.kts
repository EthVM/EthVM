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

  implementation("joda-time:joda-time:2.10.1")

  // Kafka
  compileOnly("org.apache.kafka:connect-api:${ext.get("kafka-connect-api-version") as String}")
  implementation("io.confluent:kafka-schema-registry-client:${ext.get("kafka-schema-registry-client-version") as String}")
  implementation("io.confluent:kafka-connect-avro-converter:${ext.get("kafka-connect-avro-converter-version") as String}")

  // Web3
  implementation("org.web3j:parity:4.2.0")

  // Utils
  implementation("io.arrow-kt:arrow-core:${ext.get("arrow-core-version") as String}") {
    // version conflict
    exclude("org.jetbrains.kotlin", "kotlin-stdlib-common")
    exclude("org.jetbrains.kotlin", "kotlin-stdlib-jdk7")
  }
  implementation("ch.qos.logback:logback-classic:${ext.get("logback-version") as String}")
  implementation("io.github.microutils:kotlin-logging:${ext.get("kotlin-logging-version") as String}")

  // Tests
  testImplementation("io.kotlintest:kotlintest-runner-junit5:${ext.get("kotlintest-version") as String}")
  testImplementation("io.mockk:mockk:${ext.get("mockk-version") as String}")
  testImplementation("org.apache.kafka:connect-api:${ext.get("kafka-connect-api-version") as String}")
}

project.tasks.getting(Test::class) { useJUnitPlatform {} }

val build: DefaultTask by tasks
build.dependsOn(project.tasks["shadowJar"] as ShadowJar)

tasks.withType<ShadowJar> {
  baseName = project.name
  classifier = ""
}
