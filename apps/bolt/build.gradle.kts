import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  application
  kotlin("jvm") version "1.2.70"
}

tasks.withType<KotlinCompile> {
  kotlinOptions.jvmTarget = "1.8"
}

val test by tasks.getting(Test::class) { useJUnitPlatform {} }

repositories {
  mavenLocal()
  jcenter()
  mavenCentral()
  maven("https://jitpack.io")
  maven("https://packages.confluent.io/maven/")
  maven("https://oss.sonatype.org/content/repositories/releases/")
  maven("https://dl.bintray.com/enkryptio/maven/")
  maven("https://dl.bintray.com/ethereum/maven/")
}

application {
  mainClassName = "io.enkrypt.bolt.MainKt"
}

project.java.sourceSets["main"].java {
  srcDir("src/main/kotlin")
}

dependencies {
  // Kotlin
  implementation(kotlin("stdlib"))

  // Ethereumj
  implementation(group = "org.ethereum", name ="ethereumj-core", version = "1.10.0@ethvm.2-SNAPSHOT")

  // Kafka
  implementation("org.apache.kafka:kafka-streams:2.0.0")
  implementation("io.confluent:kafka-streams-avro-serde:5.0.1")
  implementation("io.enkrypt:avro:0.0.1-SNAPSHOT")

  // mongo
  implementation("org.litote.kmongo:kmongo:3.8.2")

  // Utils
  implementation("com.github.ajalt:clikt:1.4.0")
  implementation("ch.qos.logback.logback:logback-classic:1.2.3")
  implementation("io.github.microutils:kotlin-logging:1.5.9")
  implementation("joda-time:joda-time:2.10")
  implementation("org.koin:koin-core:1.0.0-RC-2")
  implementation("io.arrow-kt:arrow-core:0.7.3")

  // Testing
  testImplementation("org.koin:koin-test:1.0.0-RC-2")
  testImplementation("io.kotlintest:kotlintest-runner-junit5:3.1.9")
}
