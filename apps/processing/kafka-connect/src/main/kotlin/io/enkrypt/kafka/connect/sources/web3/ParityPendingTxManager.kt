package io.enkrypt.kafka.connect.sources.web3

import io.enkrypt.avro.capture.TransactionRecord
import org.web3j.protocol.core.methods.response.Transaction
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class ParityPendingTxManager(private val parity: JsonRpc2_0ParityExtended) {

  private val executor = Executors.newScheduledThreadPool(1)

  private val changes = ArrayBlockingQueue<Pair<List<Transaction>, List<Transaction>>>(20)

  @Volatile
  private var error: Throwable? = null

  init {
    executor.execute(Fetch(emptyMap()))
  }

  fun poll(): Pair<List<Transaction>, List<String>> {

    val error = this.error
    if(error != null) {
      throw error
    }

    val changesList = mutableListOf<Pair<List<Transaction>, List<Transaction>>>()
    changes.drainTo(changesList)

    return changes
      .map{ (insertions, deletions) ->

        Pair(insertions.map { it.toTransactionRecord().build() })

      }
  }

  fun stop() {
    executor.shutdown()
    executor.awaitTermination(30, TimeUnit.SECONDS)
  }

  private inner class Fetch(private val state: Map<String, Transaction>) : Runnable {

    override fun run() {

      try {

        var newState = state

        val txsByHash = parity.parityGetPendingTransactions().send().transactions
          ?.map { it.hash to it }
          ?.toMap() ?: emptyMap()

        // TODO handle tx drop and replace potentially here

        var inserted = emptyList<Transaction>()
        var deleted = emptyList<Transaction>()

        txsByHash
          .forEach { (hash, tx) ->
            if (!state.containsKey(hash)) {
              newState = newState + (hash to tx)
              inserted = inserted + tx
            }
          }

        state
          .forEach{ (hash, tx) ->
            if(!txsByHash.containsKey(hash)) {
              newState = newState - hash
              deleted = deleted + tx
            }
          }

        changes.put(Pair(inserted, deleted))

        executor.schedule(Fetch(newState), 1, TimeUnit.SECONDS)

      } catch (throwable: Throwable) {
        error = throwable
      }

    }
  }


}
