import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
import org.gradle.plugins.ide.idea.model.IdeaLanguageLevel
import org.gradle.plugins.ide.idea.model.IdeaModel
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import sun.tools.jar.resources.jar

buildscript {

  val kotlinVer by extra { "1.3.10" }
  val junitPlatformVer by extra { "1.0.1" }

  val versionPluginVer = "0.15.0"
  val shadowPluginVer = "2.0.1"

  repositories {
    jcenter()
    mavenCentral()
    maven { setUrl("https://plugins.gradle.org/m2/") }
  }

  dependencies {
    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVer")
    classpath("com.github.jengelman.gradle.plugins:shadow:$shadowPluginVer")

    // gradle dependencyUpdates -Drevision=release
    classpath("com.github.ben-manes:gradle-versions-plugin:$versionPluginVer")
    classpath("org.junit.platform:junit-platform-gradle-plugin:$junitPlatformVer")
  }

}

val kotlinVer: String by extra

val kotlinLoggingVer = "1.4.6"
val logbackVer = "1.2.3"

apply {
  plugin("com.github.johnrengelman.shadow")
}

plugins {
  `java-library`
  idea
  kotlin("jvm") version("1.3.10")
}


tasks.withType<KotlinCompile> {
  kotlinOptions.jvmTarget = "1.8"
}


group = "io.enkrypt"
version = "0.0.1-SNAPSHOT"

val kafkaConnectApi = dependencies.compileOnly("org.apache.kafka:connect-api:2.0.0")

dependencies {

  // Kotlin
  implementation(kotlin("stdlib"))

  kafkaConnectApi

  implementation("org.web3j:parity:4.0.3")
  implementation("org.mongodb:mongodb-driver:3.9.0")
  implementation("io.enkrypt:avro:0.0.1-SNAPSHOT")
  implementation("io.confluent:kafka-schema-registry-client:5.0.1")
  implementation("io.confluent:kafka-connect-avro-converter:5.0.1")

  implementation("com.github.tinder:statemachine:0.1.2")
  implementation("io.arrow-kt:arrow-core:0.7.3")
  implementation("ch.qos.logback:logback-classic:1.2.3")
  implementation("io.github.microutils:kotlin-logging:1.5.9")
  implementation("com.beust:klaxon:3.0.1")
  implementation("commons-codec:commons-codec:1.11")

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

configure<IdeaModel> {
  project {
    languageLevel = IdeaLanguageLevel(JavaVersion.VERSION_1_8)
  }
  module {
    isDownloadJavadoc = true
    isDownloadSources = true
  }
}

val build: DefaultTask by tasks

val shadowJar = tasks["shadowJar"] as ShadowJar
build.dependsOn(shadowJar)

project.java.sourceSets["main"].java {
  srcDir("src/main/kotlin")
}


tasks.withType<ShadowJar> {
  baseName = "enkryptio-mongo-connectors"
}
