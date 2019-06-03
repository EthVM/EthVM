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

  implementation("com.beust:klaxon:5.0.5")

  implementation("joda-time:joda-time:2.10.1")

  implementation("io.kotlintest:kotlintest-runner-junit5:${ext.get("kotlintest-version") as String}")
  implementation("io.mockk:mockk:${ext.get("mockk-version") as String}")
}
