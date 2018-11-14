import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import sun.tools.jar.resources.jar

plugins {
  `java-library`
  distribution
  kotlin("jvm") version "1.2.71"
}

tasks.withType<KotlinCompile> {
  kotlinOptions.jvmTarget = "1.8"
}

group = "io.enkrypt"
version = "0.0.1-SNAPSHOT"

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

project.java.sourceSets["main"].java {
  srcDir("src/main/kotlin")
}

dependencies {

  // Kotlin
  implementation(kotlin("stdlib"))

  compileOnly("org.apache.kafka:connect-api:2.0.0")

  implementation("org.mongodb:mongodb-driver-reactivestreams:1.10.0")

  implementation("io.arrow-kt:arrow-core:0.7.3")
  implementation("ch.qos.logback:logback-classic:1.2.3")
  implementation("io.github.microutils:kotlin-logging:1.5.9")
}

val sourcesJar by tasks.creating(Jar::class) {
  dependsOn(JavaPlugin.CLASSES_TASK_NAME)
  classifier = "sources"
  from(project.java.sourceSets["main"].allSource)
}

val javadocJar by tasks.creating(Jar::class) {
  dependsOn(JavaPlugin.JAVADOC_TASK_NAME)
  classifier = "javadoc"
  from(tasks["javadoc"])
}

artifacts {
  add("archives", sourcesJar)
  add("archives", javadocJar)
}

distributions {

  getByName("main") {

    baseName = "someName"

    contents {
      from("distrib")
    }

  }

}
