import com.commercehub.gradle.plugin.avro.GenerateAvroProtocolTask
import com.commercehub.gradle.plugin.avro.GenerateAvroSchemaTask
import com.jfrog.bintray.gradle.BintrayExtension
import org.gradle.api.tasks.bundling.Jar

plugins {
  `java-library`
  `maven-publish`
  id("com.commercehub.gradle.plugin.avro") version "0.16.0"
  id("com.jfrog.bintray")
}

val test by tasks.getting(Test::class) { useJUnitPlatform {} }

dependencies {

  compile("org.apache.avro:avro:1.8.2")

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

artifacts {
  add("archives", tasks["sourcesJar"])
  add("archives", tasks["javadocJar"])
}

publishing {

  publications {

    create<MavenPublication>("JCenter") {
      artifactId = "avro-entities"

      from(components["java"])
      artifact(tasks["sourcesJar"])
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
    name = "io.enkrypt.ethvm.avro.entities"
    setLicenses("MIT")
    vcsUrl = "https://github.com/enkryptio/ethvm.git"
  })
}