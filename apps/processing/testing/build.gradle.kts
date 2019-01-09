import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  kotlin("jvm")
  id("org.jlleitschuh.gradle.ktlint")
}

project.java.sourceSets["main"].java {
  srcDir("src/main/kotlin")
}

dependencies {

  implementation(kotlin("stdlib"))

  implementation(project(":common"))
  implementation(project(":avro"))

  implementation(group = "io.enkrypt", name = "ethereumj-core", version = "1.10.0.0-SNAPSHOT") {
    exclude(group = "io.enkrypt.ethvm", module = "avro-entities")
    exclude(group = "org.ethereum", module = "rocksdbjni")
  }

  implementation("org.koin:koin-test:1.0.2")
  implementation("io.kotlintest:kotlintest-runner-junit5:3.1.11")
  implementation("io.mockk:mockk:1.8.13")
  implementation("commons-codec:commons-codec:1.11")
}
