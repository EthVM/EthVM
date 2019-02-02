package io.enkrypt.kafka.connect.sources.tokens

import com.beust.klaxon.Klaxon
import io.enkrypt.common.codec.Hex
import io.enkrypt.kafka.connect.utils.Versions
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.SchemaBuilder
import org.apache.kafka.connect.data.Struct
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTask
import java.net.URL
import java.time.Instant
import java.time.temporal.ChronoUnit

class EthListsTokensSourceTask : SourceTask() {

  private val klaxon = Klaxon()

  private lateinit var topic: String
  private lateinit var url: String
  private var syncIntervalSeconds: Int = -1

  private var lastSyncAt: Instant? = Instant.EPOCH

  override fun version() = Versions.CURRENT

  override fun start(props: MutableMap<String, String>?) {
    topic = EthListsTokensSourceConnector.Config.topic(props!!)
    url = EthListsTokensSourceConnector.Config.tokensUrl(props)
    syncIntervalSeconds = EthListsTokensSourceConnector.Config.syncInterval(props)
  }

  override fun stop() {
    // do nothing
  }

  override fun poll(): List<SourceRecord> {

    if (!shouldSync()) {
      Thread.sleep(60000) // wake up once a minute
      return emptyList()
    }

    val sourcePartition = mapOf("url" to url)
    val sourceOffset = emptyMap<String, Any>()

    val inputStream = URL(url).openStream()
    val entries = klaxon.parseArray<ContractMetadata>(inputStream) ?: emptyList()

    val records = entries.dropWhile { it.address.isEmpty() }.map { e ->

      val key = Struct(EthTokenKeySchema).apply {
        put("address", Hex.decode(e.address.substring(2)))
      }

      SourceRecord(
        sourcePartition,
        sourceOffset,
        topic,
        EthTokenKeySchema,
        key,
        ContractMetadataSchema,
        e.toStruct()
      )
    }

    lastSyncAt = Instant.now()

    return records
  }

  private fun shouldSync(): Boolean = ChronoUnit.SECONDS.between(lastSyncAt, Instant.now()) > syncIntervalSeconds

  companion object {

    val EthTokenKeySchema: Schema = SchemaBuilder.struct()
      .name("io.enkrypt.avro.tokens.EthTokenListsKeyRecord")
      .field("address", Schema.BYTES_SCHEMA)
      .build()

    val LogoSchema: Schema = SchemaBuilder.struct()
      .name("io.enkrypt.avro.processing.ContractLogoRecord")
      .optional()
      .field("src", Schema.OPTIONAL_STRING_SCHEMA)
      .field("width", Schema.OPTIONAL_STRING_SCHEMA)
      .field("height", Schema.OPTIONAL_STRING_SCHEMA)
      .field("ipfs_hash", Schema.OPTIONAL_STRING_SCHEMA)
      .build()

    val SupportSchema: Schema = SchemaBuilder.struct()
      .name("io.enkrypt.avro.processing.ContractSupportRecord")
      .optional()
      .field("email", Schema.OPTIONAL_STRING_SCHEMA)
      .field("url", Schema.OPTIONAL_STRING_SCHEMA)
      .build()

    val SocialSchema: Schema = SchemaBuilder.struct()
      .name("io.enkrypt.avro.processing.ContractSocialRecord")
      .optional()
      .field("blog", Schema.OPTIONAL_STRING_SCHEMA)
      .field("chat", Schema.OPTIONAL_STRING_SCHEMA)
      .field("facebook", Schema.OPTIONAL_STRING_SCHEMA)
      .field("forum", Schema.OPTIONAL_STRING_SCHEMA)
      .field("github", Schema.OPTIONAL_STRING_SCHEMA)
      .field("gitter", Schema.OPTIONAL_STRING_SCHEMA)
      .field("instagram", Schema.OPTIONAL_STRING_SCHEMA)
      .field("linkedin", Schema.OPTIONAL_STRING_SCHEMA)
      .field("reddit", Schema.OPTIONAL_STRING_SCHEMA)
      .field("slack", Schema.OPTIONAL_STRING_SCHEMA)
      .field("telegram", Schema.OPTIONAL_STRING_SCHEMA)
      .field("twitter", Schema.OPTIONAL_STRING_SCHEMA)
      .field("youtube", Schema.OPTIONAL_STRING_SCHEMA)
      .build()

    val ContractMetadataSchema: Schema = SchemaBuilder.struct()
      .name("io.enkrypt.avro.processing.ContractMetadataRecord")
      .field("name", Schema.STRING_SCHEMA)
      .field("symbol", Schema.STRING_SCHEMA)
      .field("address", Schema.BYTES_SCHEMA)
      .field("decimals", Schema.INT32_SCHEMA)
      .field("ens_address", Schema.OPTIONAL_STRING_SCHEMA)
      .field("type", Schema.OPTIONAL_STRING_SCHEMA)
      .field("logo", LogoSchema)
      .field("support", SupportSchema)
      .field("social", SocialSchema)
      .field("website", Schema.OPTIONAL_STRING_SCHEMA)
  }

  data class ContractLogo(
    val src: String? = "",
    private val width: Int? = 0,
    private val height: Int? = 0
  ) {

    fun toStruct(): Struct =
      Struct(EthListsTokensSourceTask.LogoSchema).apply {
        put("src", src)
      }
  }

  data class ContractSupport(val email: String?, val url: String?) {

    fun toStruct(): Struct =
      Struct(EthListsTokensSourceTask.SupportSchema).apply {
        put("email", email)
        put("url", url)
      }
  }

  data class ContractSocial(
    val blog: String?,
    val chat: String?,
    val facebook: String?,
    val forum: String?,
    val github: String?,
    val gitter: String?,
    val instagram: String?,
    val linkedin: String?,
    val reddit: String?,
    val slack: String?,
    val telegram: String?,
    val twitter: String?,
    val youtube: String?
  ) {

    fun toStruct(): Struct =
      Struct(EthListsTokensSourceTask.SocialSchema).apply {
        put("blog", blog)
        put("chat", chat)
        put("facebook", facebook)
        put("forum", forum)
        put("github", github)
        put("gitter", gitter)
        put("instagram", instagram)
        put("linkedin", linkedin)
        put("reddit", reddit)
        put("slack", slack)
        put("telegram", telegram)
        put("twitter", twitter)
        put("youtube", youtube)
      }
  }

  data class ContractMetadata(
    val name: String,
    val symbol: String,
    val address: String,
    val decimals: Int,
    val ens_address: String?,
    val type: String?,
    val website: String?,
    val logo: ContractLogo?,
    val support: ContractSupport?,
    val social: ContractSocial?
  ) {

    fun toStruct(): Struct =
      Struct(EthListsTokensSourceTask.ContractMetadataSchema).apply {
        put("name", name)
        put("symbol", symbol)
        put("address", Hex.decode(address.substring(2)))
        put("decimals", decimals)
        put("ens_address", ens_address)
        put("type", type)
        put("logo", logo?.toStruct())
        put("support", support?.toStruct())
        put("social", social?.toStruct())
        put("website", website)
      }
  }
}
