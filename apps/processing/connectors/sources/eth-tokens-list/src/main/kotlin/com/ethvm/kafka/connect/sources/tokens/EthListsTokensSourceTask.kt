package com.ethvm.kafka.connect.sources.tokens

import com.beust.klaxon.Klaxon
import com.ethvm.avro.capture.ContractKeyRecord
import com.ethvm.avro.capture.ContractLogoRecord
import com.ethvm.avro.capture.ContractSocialRecord
import com.ethvm.avro.capture.ContractSupportRecord
import com.ethvm.avro.capture.EthListRecord
import com.ethvm.avro.common.ContractType
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

  private var lastSyncAt: Instant? = null

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

    val records = entries
      .dropWhile { it.address == null || it.address.isEmpty() }
      .map { entry ->

        val keySchemaAndValue = AvroToConnect.toConnectData(
          ContractKeyRecord.newBuilder()
            .setAddress(entry.address)
            .build()
        )

        val valueSchemaAndValue = AvroToConnect.toConnectData(entry.toRecord())

        SourceRecord(
          sourcePartition,
          sourceOffset,
          topic,
          keySchemaAndValue.schema(),
          keySchemaAndValue.value(),
          valueSchemaAndValue.schema(),
          valueSchemaAndValue.value()
        )
      }

    lastSyncAt = Instant.now()

    return records
  }

  private fun shouldSync(): Boolean =
    when (lastSyncAt) {
      null -> true
      else -> ChronoUnit.SECONDS.between(lastSyncAt, Instant.now()) > syncIntervalSeconds
    }

  data class ContractLogo(
    val src: String? = "",
    private val width: Int? = 0,
    private val height: Int? = 0
  ) {

    fun toRecord(): ContractLogoRecord =
      ContractLogoRecord.newBuilder()
        .setSrc(src)
        .build()
  }

  data class ContractSupport(val email: String?, val url: String?) {

    fun toRecord(): ContractSupportRecord =
      ContractSupportRecord.newBuilder()
        .setEmail(email)
        .setUrl(url)
        .build()
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

    fun toRecord(): ContractSocialRecord =
      ContractSocialRecord.newBuilder()
        .setBlog(blog)
        .setChat(chat)
        .setFacebook(facebook)
        .setForum(forum)
        .setGithub(github)
        .setGitter(gitter)
        .setInstagram(instagram)
        .setLinkedin(instagram)
        .setReddit(reddit)
        .setSlack(slack)
        .setTelegram(telegram)
        .setTwitter(twitter)
        .setYoutube(youtube)
        .build()
  }

  data class ContractMetadata(
    val name: String?,
    val symbol: String?,
    val address: String?,
    val decimals: Int?,
    val ens_address: String?,
    val type: String?,
    val website: String?,
    val logo: ContractLogo?,
    val support: ContractSupport?,
    val social: ContractSocial?
  ) {

    fun toRecord(): EthListRecord =
      EthListRecord.newBuilder()
        .setName(name)
        .setSymbol(symbol)
        .setAddress(address)
        .setDecimals(decimals)
        .setEnsAddress(ens_address)
        .setType(if (type != null) ContractType.valueOf(type) else null)
        .setLogo(logo?.toRecord())
        .setSupport(support?.toRecord())
        .setSocial(social?.toRecord())
        .setWebsite(website)
        .build()
  }
}
