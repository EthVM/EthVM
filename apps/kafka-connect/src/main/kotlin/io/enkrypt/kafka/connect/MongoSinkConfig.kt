package io.enkrypt.kafka.connect

import com.mongodb.MongoClientURI

object MongoSinkConfig {

  val MONGO_URI = "mongo.uri"
  val MONGO_URI_DOC = "Mongo uri for connecting to the mongo instance"

  fun mongoUri(props: MutableMap<String, String>) = MongoClientURI(props[MONGO_URI]!!)

}
