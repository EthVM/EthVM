package io.enkrypt.util

import org.ethereum.core.*
import org.ethereum.listener.EthereumListener
import org.ethereum.net.eth.message.StatusMessage
import org.ethereum.net.message.Message
import org.ethereum.net.p2p.HelloMessage
import org.ethereum.net.rlpx.Node
import org.ethereum.net.server.Channel
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

class TestEthereumListener : EthereumListener {

  var blockSummariesLatch: CountDownLatch = CountDownLatch(0)

  var blockSummaries: List<BlockSummary> = emptyList()

  override fun onSyncDone(state: EthereumListener.SyncState?) {
  }

  override fun onSendMessage(channel: Channel?, message: Message?) {
  }

  override fun onPendingStateChanged(pendingState: PendingState?) {
  }

  override fun onRecvMessage(channel: Channel?, message: Message?) {
  }

  override fun onPendingTransactionUpdate(txReceipt: TransactionReceipt?, state: EthereumListener.PendingTransactionState?, block: Block?) {
  }

  override fun onVMTraceCreated(transactionHash: String?, trace: String?) {
  }

  override fun onBlock(blockSummary: BlockSummary) {
    blockSummaries += blockSummary
    blockSummariesLatch.countDown()
  }

  override fun onPeerDisconnect(host: String?, port: Long) {
  }

  override fun onPeerAddedToSyncPool(peer: Channel?) {
  }

  @Suppress("OverridingDeprecatedMember")
  override fun onPendingTransactionsReceived(transactions: MutableList<Transaction>?) {
  }

  override fun onTransactionExecuted(summary: TransactionExecutionSummary?) {
  }

  override fun onNodeDiscovered(node: Node?) {
  }

  override fun onHandShakePeer(channel: Channel?, helloMessage: HelloMessage?) {
  }

  override fun onEthStatusUpdated(channel: Channel?, status: StatusMessage?) {
  }

  override fun trace(output: String?) {
  }

  override fun onNoConnections() {
  }

  fun resetBlockSummaries(count: Int) {
    blockSummaries = emptyList()
    blockSummariesLatch = CountDownLatch(count)
  }

  fun waitForBlockSummaries(timeout: Long, unit: TimeUnit) {
    blockSummariesLatch.await(timeout, unit)
  }

}
