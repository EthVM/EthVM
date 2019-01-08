pluginManagement {

  repositories {
    gradlePluginPortal()
    jcenter()
    maven("https://dl.bintray.com/gradle/gradle-plugins")
  }

}


include("avro", "common", "testing", "kafka-streams", "kafka-connect")
