import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
import org.gradle.plugins.ide.idea.model.IdeaLanguageLevel
import org.gradle.plugins.ide.idea.model.IdeaModel
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import sun.tools.jar.resources.jar

plugins {
  id("com.github.johnrengelman.shadow") version "4.0.3"
  `java-library`
  kotlin("jvm")
  id("org.jlleitschuh.gradle.ktlint")
}

project.tasks.getting(Test::class) { useJUnitPlatform {} }

val build: DefaultTask by tasks
build.dependsOn(tasks["shadowJar"] as ShadowJar)

project.java.sourceSets["main"].java {
  srcDir("src/main/kotlin")
}

dependencies {

  // Kotlin
  implementation(kotlin("stdlib"))
  implementation(kotlin("reflect"))

  // Modules deps
  implementation(project(":common"))
  implementation(project(":avro"))

  // Kafka
  compileOnly("org.apache.kafka:connect-api:2.0.0")
  implementation("io.confluent:kafka-schema-registry-client:5.0.1")
  implementation("io.confluent:kafka-connect-avro-converter:5.0.1")

  // Mongo
  implementation("org.mongodb:mongodb-driver:3.9.0")

  // Web3
  implementation("org.web3j:parity:4.0.3")

  // Utils
  implementation("io.arrow-kt:arrow-core:0.8.1")
  implementation("ch.qos.logback:logback-classic:1.2.3")
  implementation("io.github.microutils:kotlin-logging:1.5.9")
  implementation("com.beust:klaxon:3.0.1")

}

tasks.withType<ShadowJar> {
  baseName = project.rootProject.group.toString() + "-" + project.name
}
