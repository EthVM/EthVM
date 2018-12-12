plugins {
  base
  kotlin("jvm") version "1.3.10" apply false
  id("org.jlleitschuh.gradle.ktlint") version "6.3.1"
}

plugins.apply("org.jlleitschuh.gradle.ktlint-idea")
subprojects {
  plugins.apply("org.jlleitschuh.gradle.ktlint")
}

allprojects {

  group = "io.enkrypt"
  version = "2.0.0"

  repositories {
    jcenter()
    mavenCentral()
    maven("https://jitpack.io")
    maven("https://packages.confluent.io/maven/")
    maven("https://oss.sonatype.org/content/repositories/releases/")
    maven("https://dl.bintray.com/enkryptio/maven/")
    maven("https://dl.bintray.com/ethereum/maven/")
  }

}
