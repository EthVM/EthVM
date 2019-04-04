import com.commercehub.gradle.plugin.avro.GenerateAvroProtocolTask
import com.commercehub.gradle.plugin.avro.GenerateAvroSchemaTask
import org.gradle.api.tasks.bundling.Jar

plugins {
  `java-library`
  `maven-publish`
  id("com.commercehub.gradle.plugin.avro") version "0.16.0"
}

val test by tasks.getting(Test::class) { useJUnitPlatform {} }

dependencies {

  compile("org.apache.avro:avro:1.8.2")
  implementation("joda-time:joda-time:2.10.1")

}

avro {
  fieldVisibility = "PUBLIC"
  isEnableDecimalLogicalType = false
}

tasks {

  "generateProtocol"(GenerateAvroProtocolTask::class) {
    source("src/main/avro")
    include("**/*.avdl")
    setOutputDir(File("build/generated-main-avro-avpr"))
  }

  "generateSchema"(GenerateAvroSchemaTask::class) {
    dependsOn("generateProtocol")
    source("src/main/avro", "build/generated-main-avro-avpr")
    include("**/*.avpr")
    setOutputDir(File("build/generated-main-avro-avsc"))

  }

  "sourcesJar"(Jar::class) {
    dependsOn(JavaPlugin.CLASSES_TASK_NAME)
    classifier = "sources"
    from(project.java.sourceSets["main"].allSource)
  }

  "javadocJar"(Jar::class) {
    dependsOn(JavaPlugin.JAVADOC_TASK_NAME)
    classifier = "javadoc"
    from(tasks["javadoc"])
  }
}
