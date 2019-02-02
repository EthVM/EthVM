plugins {
  kotlin("jvm")
  id("org.jlleitschuh.gradle.ktlint")
}

project.java.sourceSets["main"].java {
  srcDir("src/main/kotlin")
}

dependencies {
  implementation(kotlin("stdlib"))

  implementation(project(":avro"))

  implementation(group = "org.ethereum", name = "ethereumj-core", version = "1.9.+")
  implementation("commons-codec:commons-codec:1.11")

  implementation("io.kotlintest:kotlintest-runner-junit5:${ext.get("kotlintest-version") as String}")
  implementation("io.mockk:mockk:${ext.get("mockk-version") as String}")
}
