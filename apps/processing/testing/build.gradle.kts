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

  implementation(group = "io.enkrypt", name = "ethereumj-core", version = (ext.get("ethereumj-version") as String)) {
    exclude(group = "io.enkrypt.ethvm", module = "avro-entities")
    exclude(group = "org.ethereum", module = "rocksdbjni")
  }

  implementation("io.kotlintest:kotlintest-runner-junit5:${ext.get("kotlintest-version") as String}")
  implementation("io.mockk:mockk:${ext.get("mockk-version") as String}")
  implementation("org.koin:koin-test:1.0.2")
  implementation("commons-codec:commons-codec:1.11")
}
