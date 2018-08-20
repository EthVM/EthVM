plugins {
    application
    kotlin("jvm") version "1.2.60"
}

repositories {
    jcenter()
    maven("https://jitpack.io")
}

application {
    mainClassName = "io.enkrypt.bolt.MainKt"
}

dependencies {
    compile(kotlin("stdlib"))

    // Kafka
    compile("org.apache.kafka:kafka-streams:2.0.0")

    // Utils
    compile("com.github.ajalt:clikt:1.4.0")
    compile("io.github.microutils:kotlin-logging:1.5.9")
}
