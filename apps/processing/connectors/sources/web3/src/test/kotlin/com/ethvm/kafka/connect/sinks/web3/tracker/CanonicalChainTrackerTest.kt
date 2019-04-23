package com.ethvm.kafka.connect.sinks.web3.tracker

import arrow.core.None
import com.ethvm.common.extensions.hexToBI
import com.ethvm.common.extensions.toHex
import com.ethvm.kafka.connect.sinks.web3.test.AbstractParity
import com.ethvm.kafka.connect.sources.web3.tracker.CanonicalChainTracker
import io.kotlintest.shouldBe
import io.kotlintest.shouldNotBe
import io.kotlintest.specs.BehaviorSpec
import io.mockk.every
import io.mockk.mockk
import io.reactivex.BackpressureStrategy
import io.reactivex.Flowable
import io.reactivex.FlowableTransformer
import io.reactivex.schedulers.Schedulers
import io.reactivex.subjects.PublishSubject
import io.reactivex.subjects.Subject
import mu.KotlinLogging
import org.reactivestreams.Publisher
import org.reactivestreams.Subscriber
import org.reactivestreams.Subscription
import org.web3j.protocol.ObjectMapperFactory
import org.web3j.protocol.Web3jService
import org.web3j.protocol.core.Request
import org.web3j.protocol.core.methods.response.EthBlockNumber
import org.web3j.protocol.websocket.events.NewHeadsNotification
import java.math.BigInteger
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.atomic.AtomicReference

class CanonicalChainTrackerTest : BehaviorSpec() {

  init {

    given("a canonical chain tracker") {

      val parity = FakeParity(FakeParity.INTERVAL_PERIOD_OF_100)
      val tracker = CanonicalChainTracker(parity)

      `when`("we ask for the first range") {

        @Suppress("BlockingMethodInNonBlockingContext")
        Thread.sleep(1200) // Enough to produce a batch of 12 Heads approx

        val (range, reOrgs) = tracker.nextRange()
        tracker.stop()

        then("it should return properly the range [0 - 9]") {
          range shouldNotBe None
          range.fold(
            { throw IllegalStateException("Invalid state!") },
            {
              it.first shouldBe 0L
              it.endInclusive shouldBe 8L
            }
          )
          reOrgs shouldBe emptyList()
        }
      }
    }
  }
}

class FakeParity(
  private val newHeadsInterval: Long = INTERVAL_PERIOD_OF_100,
  private val bufferHeads: Int = 8,
  private val reOrgOf: Int = 0
) : AbstractParity() {

  private val mapper = ObjectMapperFactory.getObjectMapper()
  private val web3Service = mockk<Web3jService>()

  private val logger = KotlinLogging.logger {}

  init {
    // Give default behavior to web3jService
    val response = EthBlockNumber().apply {
      result = "0x${10.toString(16)}"
    }

    every { web3Service.send<EthBlockNumber>(any(), any()) } returns response
  }

  override fun newHeadsNotifications(): Flowable<NewHeadsNotification> {
    val s: Subject<List<NewHeadsNotification>> = PublishSubject.create()

    val headsSub = Flowable.interval(newHeadsInterval, TimeUnit.MILLISECONDS)
      .subscribeOn(Schedulers.single())
      .map { newHead(it.toBigInteger()) }
      .compose(FakeReOrgTransformer<NewHeadsNotification>(bufferHeads, reOrgOf))
      .subscribe { s.onNext(it) }

    return s
      .doOnDispose { headsSub.dispose() }
      .flatMapIterable { it }
      .doOnNext { logger.debug { "New head notification: ${it.params.result.number.hexToBI()}" } }
      .toFlowable(BackpressureStrategy.BUFFER)
  }

  override fun ethBlockNumber(): Request<*, EthBlockNumber> =
    Request("eth_blockNumber", emptyList<String>(), web3Service, EthBlockNumber::class.java)

  private fun newHead(number: BigInteger): NewHeadsNotification {
    val raw = """
      {
        "jsonrpc":"2.0",
        "method":"eth_subscription",
        "params": {
          "result": {
            "number":"${number.toHex()}",
            "difficulty":"0x15d9223a23aa",
            "extraData":"0xd983010305844765746887676f312e342e328777696e646f7773",
            "gasLimit":"0x47e7c4",
            "gasUsed":"0x38658",
            "logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "miner":"0xf8b483dba2c3b7176a3da549ad41a48bb3121069",
            "nonce":"0x084149998194cc5f",
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

  companion object {
    const val INTERVAL_PERIOD_OF_100 = 100L
  }
}

private class FakeReOrgTransformer<T>(
  private val each: Int = 8,
  private val take: Int = 0
) : FlowableTransformer<T, List<T>> {

  override fun apply(upstream: Flowable<T>): Publisher<List<T>> = Publisher { s -> upstream.subscribe(ReOrgSubscriber(s)) }

  internal inner class ReOrgSubscriber<T>(
    private val subscriber: Subscriber<in List<T>>
  ) : Subscriber<T> {

    private val wip = AtomicInteger(0)

    @Volatile
    private var subscription: Subscription? = null

    private val buffer = AtomicReference<MutableList<T>>()

    private val logger = KotlinLogging.logger {}

    override fun onSubscribe(s: Subscription) {
      subscription = s
      reset()
      s.request(each.toLong())
      wip.addAndGet(each)
    }

    override fun onNext(t: T) {
      if (wip.decrementAndGet() == 0) {
        subscription!!.request(each.toLong())
        wip.addAndGet(each)
      }

      buffer.get().add(t)

      synchronized(subscriber) {
        if (buffer.get().size == each) {
          if (take > 0) {
            logger.debug { "Re-org triggered!" }
          }

          val heads = ArrayList(buffer.get())
          reset()

          val reOrg = heads.subList(heads.size - take, heads.size)
          heads.addAll(reOrg)

          subscriber.onNext(heads)
        }
      }
    }

    override fun onError(t: Throwable) {
      synchronized(subscriber) {
        subscriber.onError(t)
      }
    }

    override fun onComplete() {
      synchronized(subscriber) {
        subscriber.onComplete()
      }
    }

    private fun reset() {
      buffer.set(ArrayList())
    }
  }
}
