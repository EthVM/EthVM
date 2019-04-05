package io.enkrypt.kafka.connect.sinks.web3

import io.enkrypt.common.extensions.toHex
import io.enkrypt.kafka.connect.sources.web3.CanonicalChainTracker
import io.kotlintest.shouldNotBe
import io.kotlintest.specs.BehaviorSpec
import io.mockk.every
import io.mockk.mockk
import io.reactivex.BackpressureStrategy
import io.reactivex.Flowable
import io.reactivex.schedulers.Schedulers
import io.reactivex.subjects.BehaviorSubject
import org.web3j.protocol.ObjectMapperFactory
import org.web3j.protocol.Web3jService
import org.web3j.protocol.core.Request
import org.web3j.protocol.core.Response
import org.web3j.protocol.core.methods.response.EthBlockNumber
import org.web3j.protocol.websocket.events.NewHeadsNotification
import java.math.BigInteger
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

class CanonicalChainTrackerTest : BehaviorSpec() {

  init {

    given("a new canonical chain tracker") {

      val tracker = CanonicalChainTracker(
        FakeParity(),
        0
      )

      `when`("we poll for next ranges") {

        val ranges = ArrayList<LongRange>()
        latch(count = 10) {
          val range = tracker.nextRange().first
          range.fold({}, { ranges.add(it) })
          countDown()
        }

        then("we should return properly the next range") {
          ranges shouldNotBe emptyList<LongRange>()
        }
      }
    }
  }
}

class FakeParity : AbstractFakeParity() {

  private val mapper = ObjectMapperFactory.getObjectMapper()
  private val web3Service = mockk<Web3jService>()

  private var bn: BigInteger = 0.toBigInteger()

  init {
    // Give default behavior to web3jService
    every { web3Service.send<Response<EthBlockNumber>>(any(), any()) } returns Response<EthBlockNumber>().apply {
      result = EthBlockNumber().apply { result = bn.toHex() }
    }
  }

  override fun newHeadsNotifications(): Flowable<NewHeadsNotification> {
    val subject = BehaviorSubject.create<NewHeadsNotification>()

    val intervalSubscription = Flowable.interval(250, TimeUnit.MILLISECONDS)
      .subscribeOn(Schedulers.single())
      .subscribe {
        val notification = newHead(bn)
        bn = bn.inc()
        subject.onNext(notification)
      }

    return subject
      .doOnDispose { intervalSubscription.dispose() }
      .toFlowable(BackpressureStrategy.BUFFER)
  }

  override fun ethBlockNumber(): Request<*, EthBlockNumber> = Request(
    "eth_blockNumber",
    emptyList<String>(),
    web3Service,
    EthBlockNumber::class.java
  )

  private fun newHead(number: BigInteger): NewHeadsNotification {
    val raw = """
      {
        "jsonrpc":"2.0",
        "method":"eth_subscription",
        "params": {
          "result": {
            "difficulty":"0x15d9223a23aa",
            "extraData":"0xd983010305844765746887676f312e342e328777696e646f7773",
            "gasLimit":"0x47e7c4",
            "gasUsed":"0x38658",
            "logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "miner":"0xf8b483dba2c3b7176a3da549ad41a48bb3121069",
            "nonce":"0x084149998194cc5f",
            "number":"${number.toHex()}",
            "parentHash":"0x7736fab79e05dc611604d22470dadad26f56fe494421b5b333de816ce1f25701",
            "receiptRoot":"0x2fab35823ad00c7bb388595cb46652fe7886e00660a01e867824d3dceb1c8d36",
            "sha3Uncles":"0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
            "stateRoot":"0xb3346685172db67de536d8765c43c31009d0eb3bd9c501c9be3229203f15f378",
            "timestamp":"0x56ffeff8",
            "transactionsRoot":"0x0167ffa60e3ebc0b080cdb95f7c0087dd6c0e61413140e39d94d3468d7c9689f"
          },
          "subscription":"0x9ce59a13059e417087c02d3236a0b1cc"
        }
      }
    """.trimIndent()

    return mapper.readValue<NewHeadsNotification>(raw, NewHeadsNotification::class.java)
  }
}

inline fun <R> latch(count: Int = 1, block: CountDownLatch.() -> R): R {
  val latch = CountDownLatch(count)
  val r = latch.block()
  latch.await()
  return r
}

inline fun <R> latch(count: Int = 1, timeoutSec: Long, block: CountDownLatch.() -> R): R {
  val latch = CountDownLatch(count)
  val r = latch.block()
  latch.await(timeoutSec, TimeUnit.SECONDS)
  return r
}
