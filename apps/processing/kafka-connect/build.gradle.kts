import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
import com.jfrog.bintray.gradle.BintrayExtension
import org.gradle.plugins.ide.idea.model.IdeaLanguageLevel
import org.gradle.plugins.ide.idea.model.IdeaModel
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import sun.tools.jar.resources.jar

plugins {
  `java-library`
  `maven-publish`
  kotlin("jvm")
  id("com.github.johnrengelman.shadow") version "4.0.3"
  id("org.jlleitschuh.gradle.ktlint")
  id("com.jfrog.bintray")
}

project.java.sourceSets["main"].java {
  srcDir("src/main/kotlin")
}

dependencies {

  // Kotlin
  implementation(kotlin("stdlib"))

  // Modules deps
  implementation(project(":common"))
  implementation(project(":avro"))

  // Kafka
  compileOnly("org.apache.kafka:connect-api:2.1.0")
  implementation("io.confluent:kafka-schema-registry-client:5.1.0")
  implementation("io.confluent:kafka-connect-avro-converter:5.1.0")

  // Mongo
  implementation("org.mongodb:mongodb-driver:3.9.1")

  // Web3
  implementation("org.web3j:parity:4.0.3")

  // Utils
  implementation("io.arrow-kt:arrow-core:0.8.1")
  implementation("ch.qos.logback:logback-classic:1.2.3")
  implementation("io.github.microutils:kotlin-logging:1.6.22")
  implementation("com.beust:klaxon:3.0.5")

  // Tests
  testImplementation("io.kotlintest:kotlintest-runner-junit5:${ext.get("kotlintest-version") as String}")
  testImplementation("io.mockk:mockk:${ext.get("mockk-version") as String}")
  testImplementation("org.apache.kafka:connect-api:2.1.0")
}

project.tasks.getting(Test::class) { useJUnitPlatform {} }

val build: DefaultTask by tasks
build.dependsOn(project.tasks["shadowJar"] as ShadowJar)

tasks {
  "copyJar"(Copy::class) {
    dependsOn("shadowJar")
    from("build/libs/") { include("**/*.jar") }
    into("libs/")
  }

  "buildConnectJar" {
    group = "build"
    dependsOn("copyJar")
  }
}

tasks.withType<ShadowJar> {
  baseName = project.name
  classifier = ""
}

publishing {

  publications {

    create<MavenPublication>("JCenter") {
      artifactId = project.name
      project.shadow.component(this)
    }

  }

}

bintray {
  user = project.findProperty("bintrayUser")?.toString() ?: ""
  key = project.findProperty("bintrayKey")?.toString() ?: ""

  dryRun = false
  publish = true

  setPublications("JCenter")

  pkg(delegateClosureOf<BintrayExtension.PackageConfig> {
    userOrg = "enkryptio"
    repo = "maven"
    name = "io.enkrypt.ethvm.kafka-connect"
    setLicenses("MIT")
    vcsUrl = "https://github.com/enkryptio/ethvm.git"
  })
}
