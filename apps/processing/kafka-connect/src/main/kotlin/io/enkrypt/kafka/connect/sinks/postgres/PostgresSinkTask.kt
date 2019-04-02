package io.enkrypt.kafka.connect.sinks.postgres

import io.enkrypt.kafka.connect.utils.Versions
import mu.KotlinLogging
import org.apache.kafka.connect.sink.SinkRecord
import org.apache.kafka.connect.sink.SinkTask
import org.davidmoten.rx.jdbc.Database

class PostgresSinkTask : SinkTask() {

  private val logger = KotlinLogging.logger {}

  private lateinit var db: Database

  override fun version() = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {

    db = Database.from(
      PostgresSinkConfig.Url.getString(props),
      PostgresSinkConfig.PoolSize.getInt(props)
    )
  }

  override fun stop() {
    db.close()
  }

  override fun put(records: MutableCollection<SinkRecord>?) {
    TODO("not implemented") // To change body of created functions use File | Settings | File Templates.
  }
}
