import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  base
  kotlin("jvm") version "1.3.10" apply false
  id("org.jlleitschuh.gradle.ktlint") version "6.3.1" apply false
  id("com.jfrog.bintray") version "1.8.4" apply false
}

apply(plugin = "org.jlleitschuh.gradle.ktlint-idea")
subprojects {
  if (name == "kafka-connect" || name == "kafka-streams") {
    plugins.apply("org.jlleitschuh.gradle.ktlint")
  }
}

allprojects {

  group = "io.enkrypt.ethvm"

  repositories {
    mavenLocal()
    mavenCentral()
    jcenter()
    maven("https://jitpack.io")
    maven("https://packages.confluent.io/maven/")
    maven("https://oss.sonatype.org/content/repositories/releases/")
    maven("https://dl.bintray.com/enkryptio/maven/")
    maven("https://dl.bintray.com/ethereum/maven/")
  }

  tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "1.8"
  }

}
