package io.enkrypt.kafka.connect.sinks.web3

import io.enkrypt.kafka.connect.sources.web3.CanonicalChainTracker
import io.kotlintest.specs.BehaviorSpec
import io.reactivex.BackpressureStrategy
import io.reactivex.Flowable
import io.reactivex.schedulers.Schedulers
import io.reactivex.subjects.BehaviorSubject
import org.web3j.protocol.core.Request
import org.web3j.protocol.core.Response
import org.web3j.protocol.core.methods.response.EthBlockNumber
import org.web3j.protocol.websocket.events.NewHead
import org.web3j.protocol.websocket.events.NewHeadsNotification
import java.util.concurrent.TimeUnit

class CanonicalChainTrackerTest : BehaviorSpec() {

  init {

    given("a new canonical chain tracker") {

      val tracker = CanonicalChainTracker(
        FakeNewHeadsParity(),
        0
      )

      `when`("we poll for next ranges") {

        then("we should return properly the next range") {
        }
      }
    }
  }
}

class FakeNewHeadsParity : AbstractFakeParity() {

  override fun newHeadsNotifications(): Flowable<NewHeadsNotification> {
    val subject = BehaviorSubject.create<NewHeadsNotification>()

    val intervalSubscription = Flowable.interval(250, TimeUnit.MILLISECONDS)
      .subscribeOn(Schedulers.single())
      .subscribe {
        val head = NewHead().apply { number = "0x${it.toString(16)}" }
        val notification = NewHeadsNotification(head)
        subject.onNext(notification)
      }

    return subject
      .doOnDispose { intervalSubscription.dispose() }
      .toFlowable(BackpressureStrategy.BUFFER)
  }

  override fun ethBlockNumber(): Request<*, EthBlockNumber> {
    return Request(
      "eth_blockNumber",
      emptyList<String>(),
      FakeWeb3JService,
      EthBlockNumber::class.java
    )
  }
}

private object FakeWeb3JService : AbstractFakeWeb3JService() {

  override fun <T : Response<*>?> send(request: Request<*, out Response<*>>?, responseType: Class<T>?): T {
    return EthBlockNumber().apply { result = "0x0" } as T
  }
}
