plugins {
  base
  kotlin("jvm") version "1.3.10" apply false
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
