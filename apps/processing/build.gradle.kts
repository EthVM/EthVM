import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  val ktlintVersion = "7.3.0"

  base
  kotlin("jvm") version "1.3.30" apply false
  id("org.jlleitschuh.gradle.ktlint") version ktlintVersion apply false
  id("org.jlleitschuh.gradle.ktlint-idea") version ktlintVersion apply true
}

allprojects {

  group = "com.ethvm"

  repositories {
    mavenLocal()
    jcenter()
    maven("https://jitpack.io")
    maven("https://packages.confluent.io/maven/")
    maven("https://oss.sonatype.org/content/repositories/releases/")
    maven("https://dl.bintray.com/ethereum/maven/")
  }

  tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "1.8"
  }

  ext {
    set("ethereumj-version", "1.11.0-RELEASE")
    set("kotlintest-version", "3.3.2")
    set("mockk-version", "1.9.3")
    set("arrow-core-version", "0.8.2")
    set("logback-version", "1.2.3")
    set("kotlin-logging-version", "1.6.26")
    set("kafka-connect-api-version", "2.1.0")
    set("kafka-clients-version", "2.1.0")
    set("kafka-schema-registry-client-version", "5.1.0")
    set("kafka-connect-avro-converter-version", "5.1.0")
  }

}
