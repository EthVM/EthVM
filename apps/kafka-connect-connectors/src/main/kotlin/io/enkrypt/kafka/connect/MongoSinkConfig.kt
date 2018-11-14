package io.enkrypt.kafka.connect

object MongoSinkConfig {

  val MONGO_URI = "mongo.uri"
  val MONGO_URI_DOC = "Mongo uri for connecting to the mongo instance"

  fun mongoUri(props: Map<String, String>?) = props?.get(MONGO_URI)!!

}
