package com.ethvm.kafka.connect.sinks.web3

import io.reactivex.Flowable
import org.web3j.crypto.WalletFile
import org.web3j.protocol.admin.methods.response.BooleanResponse
import org.web3j.protocol.admin.methods.response.NewAccountIdentifier
import org.web3j.protocol.admin.methods.response.PersonalListAccounts
import org.web3j.protocol.admin.methods.response.PersonalSign
import org.web3j.protocol.admin.methods.response.PersonalUnlockAccount
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.Request
import org.web3j.protocol.core.methods.request.EthFilter
import org.web3j.protocol.core.methods.request.ShhFilter
import org.web3j.protocol.core.methods.request.ShhPost
import org.web3j.protocol.core.methods.request.Transaction
import org.web3j.protocol.core.methods.response.DbGetHex
import org.web3j.protocol.core.methods.response.DbGetString
import org.web3j.protocol.core.methods.response.DbPutHex
import org.web3j.protocol.core.methods.response.DbPutString
import org.web3j.protocol.core.methods.response.EthAccounts
import org.web3j.protocol.core.methods.response.EthBlock
import org.web3j.protocol.core.methods.response.EthBlockNumber
import org.web3j.protocol.core.methods.response.EthCall
import org.web3j.protocol.core.methods.response.EthCoinbase
import org.web3j.protocol.core.methods.response.EthCompileLLL
import org.web3j.protocol.core.methods.response.EthCompileSerpent
import org.web3j.protocol.core.methods.response.EthCompileSolidity
import org.web3j.protocol.core.methods.response.EthEstimateGas
import org.web3j.protocol.core.methods.response.EthGasPrice
import org.web3j.protocol.core.methods.response.EthGetBalance
import org.web3j.protocol.core.methods.response.EthGetBlockTransactionCountByHash
import org.web3j.protocol.core.methods.response.EthGetBlockTransactionCountByNumber
import org.web3j.protocol.core.methods.response.EthGetCode
import org.web3j.protocol.core.methods.response.EthGetCompilers
import org.web3j.protocol.core.methods.response.EthGetStorageAt
import org.web3j.protocol.core.methods.response.EthGetTransactionCount
import org.web3j.protocol.core.methods.response.EthGetTransactionReceipt
import org.web3j.protocol.core.methods.response.EthGetUncleCountByBlockHash
import org.web3j.protocol.core.methods.response.EthGetUncleCountByBlockNumber
import org.web3j.protocol.core.methods.response.EthGetWork
import org.web3j.protocol.core.methods.response.EthHashrate
import org.web3j.protocol.core.methods.response.EthLog
import org.web3j.protocol.core.methods.response.EthMining
import org.web3j.protocol.core.methods.response.EthProtocolVersion
import org.web3j.protocol.core.methods.response.EthSendTransaction
import org.web3j.protocol.core.methods.response.EthSign
import org.web3j.protocol.core.methods.response.EthSubmitHashrate
import org.web3j.protocol.core.methods.response.EthSubmitWork
import org.web3j.protocol.core.methods.response.EthSyncing
import org.web3j.protocol.core.methods.response.EthTransaction
import org.web3j.protocol.core.methods.response.EthUninstallFilter
import org.web3j.protocol.core.methods.response.Log
import org.web3j.protocol.core.methods.response.NetListening
import org.web3j.protocol.core.methods.response.NetPeerCount
import org.web3j.protocol.core.methods.response.NetVersion
import org.web3j.protocol.core.methods.response.ShhAddToGroup
import org.web3j.protocol.core.methods.response.ShhHasIdentity
import org.web3j.protocol.core.methods.response.ShhMessages
import org.web3j.protocol.core.methods.response.ShhNewFilter
import org.web3j.protocol.core.methods.response.ShhNewGroup
import org.web3j.protocol.core.methods.response.ShhNewIdentity
import org.web3j.protocol.core.methods.response.ShhUninstallFilter
import org.web3j.protocol.core.methods.response.ShhVersion
import org.web3j.protocol.core.methods.response.Web3ClientVersion
import org.web3j.protocol.core.methods.response.Web3Sha3
import org.web3j.protocol.parity.Parity
import org.web3j.protocol.parity.methods.request.Derivation
import org.web3j.protocol.parity.methods.request.TraceFilter
import org.web3j.protocol.parity.methods.response.ParityAddressesResponse
import org.web3j.protocol.parity.methods.response.ParityAllAccountsInfo
import org.web3j.protocol.parity.methods.response.ParityDefaultAddressResponse
import org.web3j.protocol.parity.methods.response.ParityDeriveAddress
import org.web3j.protocol.parity.methods.response.ParityExportAccount
import org.web3j.protocol.parity.methods.response.ParityFullTraceResponse
import org.web3j.protocol.parity.methods.response.ParityListRecentDapps
import org.web3j.protocol.parity.methods.response.ParityTraceGet
import org.web3j.protocol.parity.methods.response.ParityTracesResponse
import org.web3j.protocol.websocket.events.LogNotification
import org.web3j.protocol.websocket.events.NewHeadsNotification
import java.math.BigInteger
import java.util.ArrayList

abstract class AbstractFakeParity : Parity {

  override fun parityNewAccountFromSecret(secret: String?, password: String?): Request<*, NewAccountIdentifier> {
    TODO("not implemented")
  }

  override fun ethGetTransactionCount(address: String?, defaultBlockParameter: DefaultBlockParameter?): Request<*, EthGetTransactionCount> {
    TODO("not implemented")
  }

  override fun parityExportAccount(accountId: String?, password: String?): Request<*, ParityExportAccount> {
    TODO("not implemented")
  }

  override fun replayPastAndFutureBlocksFlowable(startBlock: DefaultBlockParameter?, fullTransactionObjects: Boolean): Flowable<EthBlock> {
    TODO("not implemented")
  }

  override fun ethCoinbase(): Request<*, EthCoinbase> {
    TODO("not implemented")
  }

  override fun traceTransaction(hash: String?): Request<*, ParityTracesResponse> {
    TODO("not implemented")
  }

  override fun ethGetUncleCountByBlockNumber(defaultBlockParameter: DefaultBlockParameter?): Request<*, EthGetUncleCountByBlockNumber> {
    TODO("not implemented")
  }

  override fun ethGetTransactionByBlockHashAndIndex(blockHash: String?, transactionIndex: BigInteger?): Request<*, EthTransaction> {
    TODO("not implemented")
  }

  override fun ethLogFlowable(ethFilter: EthFilter?): Flowable<Log> {
    TODO("not implemented")
  }

  override fun logsNotifications(addresses: MutableList<String>?, topics: MutableList<String>?): Flowable<LogNotification> {
    TODO("not implemented")
  }

  override fun traceRawTransaction(data: String?, traceTypes: MutableList<String>?): Request<*, ParityFullTraceResponse> {
    TODO("not implemented")
  }

  override fun shhVersion(): Request<*, ShhVersion> {
    TODO("not implemented")
  }

  override fun shhAddToGroup(identityAddress: String?): Request<*, ShhAddToGroup> {
    TODO("not implemented")
  }

  override fun blockFlowable(fullTransactionObjects: Boolean): Flowable<EthBlock> {
    TODO("not implemented")
  }

  override fun ethGetFilterLogs(filterId: BigInteger?): Request<*, EthLog> {
    TODO("not implemented")
  }

  override fun ethBlockHashFlowable(): Flowable<String> {
    TODO("not implemented")
  }

  override fun parityTestPassword(accountId: String?, password: String?): Request<*, BooleanResponse> {
    TODO("not implemented")
  }

  override fun ethPendingTransactionHashFlowable(): Flowable<String> {
    TODO("not implemented")
  }

  override fun parityNewAccountFromPhrase(phrase: String?, password: String?): Request<*, NewAccountIdentifier> {
    TODO("not implemented")
  }

  override fun web3Sha3(data: String?): Request<*, Web3Sha3> {
    TODO("not implemented")
  }

  override fun shhUninstallFilter(filterId: BigInteger?): Request<*, ShhUninstallFilter> {
    TODO("not implemented")
  }

  override fun ethNewBlockFilter(): Request<*, org.web3j.protocol.core.methods.response.EthFilter> {
    TODO("not implemented")
  }

  override fun netVersion(): Request<*, NetVersion> {
    TODO("not implemented")
  }

  override fun ethNewFilter(ethFilter: EthFilter?): Request<*, org.web3j.protocol.core.methods.response.EthFilter> {
    TODO("not implemented")
  }

  override fun parityAllAccountsInfo(): Request<*, ParityAllAccountsInfo> {
    TODO("not implemented")
  }

  override fun ethGasPrice(): Request<*, EthGasPrice> {
    TODO("not implemented")
  }

  override fun ethCall(transaction: Transaction?, defaultBlockParameter: DefaultBlockParameter?): Request<*, EthCall> {
    TODO("not implemented")
  }

  override fun personalUnlockAccount(address: String?, passphrase: String?, duration: BigInteger?): Request<*, PersonalUnlockAccount> {
    TODO("not implemented")
  }

  override fun personalUnlockAccount(address: String?, passphrase: String?): Request<*, PersonalUnlockAccount> {
    TODO("not implemented")
  }

  override fun ethBlockNumber(): Request<*, EthBlockNumber> {
    TODO("not implemented")
  }

  override fun ethSendRawTransaction(signedTransactionData: String?): Request<*, EthSendTransaction> {
    TODO("not implemented")
  }

  override fun parityListRecentDapps(): Request<*, ParityListRecentDapps> {
    TODO("not implemented")
  }

  override fun paritySetAccountName(address: String?, name: String?): Request<*, BooleanResponse> {
    TODO("not implemented")
  }

  override fun traceFilter(traceFilter: TraceFilter?): Request<*, ParityTracesResponse> {
    TODO("not implemented")
  }

  override fun parityKillAccount(accountId: String?, password: String?): Request<*, BooleanResponse> {
    TODO("not implemented")
  }

  override fun ethGetCompilers(): Request<*, EthGetCompilers> {
    TODO("not implemented")
  }

  override fun ethUninstallFilter(filterId: BigInteger?): Request<*, EthUninstallFilter> {
    TODO("not implemented")
  }

  override fun ethSyncing(): Request<*, EthSyncing> {
    TODO("not implemented")
  }

  override fun shhNewGroup(): Request<*, ShhNewGroup> {
    TODO("not implemented")
  }

  override fun traceBlock(blockParameter: DefaultBlockParameter?): Request<*, ParityTracesResponse> {
    TODO("not implemented")
  }

  override fun ethSubmitWork(nonce: String?, headerPowHash: String?, mixDigest: String?): Request<*, EthSubmitWork> {
    TODO("not implemented")
  }

  override fun replayPastBlocksFlowable(
    startBlock: DefaultBlockParameter?,
    endBlock: DefaultBlockParameter?,
    fullTransactionObjects: Boolean
  ): Flowable<EthBlock> {
    TODO("not implemented")
  }

  override fun replayPastBlocksFlowable(
    startBlock: DefaultBlockParameter?,
    endBlock: DefaultBlockParameter?,
    fullTransactionObjects: Boolean,
    ascending: Boolean
  ): Flowable<EthBlock> {
    TODO("not implemented")
  }

  override fun replayPastBlocksFlowable(
    startBlock: DefaultBlockParameter?,
    fullTransactionObjects: Boolean,
    onCompleteFlowable: Flowable<EthBlock>?
  ): Flowable<EthBlock> {
    TODO("not implemented")
  }

  override fun replayPastBlocksFlowable(startBlock: DefaultBlockParameter?, fullTransactionObjects: Boolean): Flowable<EthBlock> {
    TODO("not implemented")
  }

  override fun ethHashrate(): Request<*, EthHashrate> {
    TODO("not implemented")
  }

  override fun traceCall(
    transaction: Transaction?,
    traceTypes: MutableList<String>?,
    blockParameter: DefaultBlockParameter?
  ): Request<*, ParityFullTraceResponse> {
    TODO("not implemented")
  }

  override fun parityGetNewDappsDefaultAddress(): Request<*, ParityDefaultAddressResponse> {
    TODO("not implemented")
  }

  override fun shhGetFilterChanges(filterId: BigInteger?): Request<*, ShhMessages> {
    TODO("not implemented")
  }

  override fun ethGetBalance(address: String?, defaultBlockParameter: DefaultBlockParameter?): Request<*, EthGetBalance> {
    TODO("not implemented")
  }

  override fun ethAccounts(): Request<*, EthAccounts> {
    TODO("not implemented")
  }

  override fun paritySetDappDefaultAddress(dAppId: String?, defaultAddress: String?): Request<*, BooleanResponse> {
    TODO("not implemented")
  }

  override fun dbPutString(databaseName: String?, keyName: String?, stringToStore: String?): Request<*, DbPutString> {
    TODO("not implemented")
  }

  override fun newHeadsNotifications(): Flowable<NewHeadsNotification> {
    TODO("not implemented")
  }

  override fun ethGetTransactionByBlockNumberAndIndex(
    defaultBlockParameter: DefaultBlockParameter?,
    transactionIndex: BigInteger?
  ): Request<*, EthTransaction> {
    TODO("not implemented")
  }

  override fun ethGetUncleByBlockHashAndIndex(blockHash: String?, transactionIndex: BigInteger?): Request<*, EthBlock> {
    TODO("not implemented")
  }

  override fun traceGet(hash: String?, indices: MutableList<BigInteger>?): Request<*, ParityTraceGet> {
    TODO("not implemented")
  }

  override fun parityNewAccountFromWallet(walletFile: WalletFile?, password: String?): Request<*, NewAccountIdentifier> {
    TODO("not implemented")
  }

  override fun shhNewIdentity(): Request<*, ShhNewIdentity> {
    TODO("not implemented")
  }

  override fun shutdown() {
    TODO("not implemented")
  }

  override fun paritySetAccountMeta(accountId: String?, metadata: MutableMap<String, Any>?): Request<*, BooleanResponse> {
    TODO("not implemented")
  }

  override fun ethProtocolVersion(): Request<*, EthProtocolVersion> {
    TODO("not implemented")
  }

  override fun replayPastAndFutureTransactionsFlowable(startBlock: DefaultBlockParameter?): Flowable<org.web3j.protocol.core.methods.response.Transaction> {
    TODO("not implemented")
  }

  override fun paritySetNewDappsAddresses(availableAccountIds: ArrayList<String>?): Request<*, BooleanResponse> {
    TODO("not implemented")
  }

  override fun ethGetTransactionReceipt(transactionHash: String?): Request<*, EthGetTransactionReceipt> {
    TODO("not implemented")
  }

  override fun ethCompileSolidity(sourceCode: String?): Request<*, EthCompileSolidity> {
    TODO("not implemented")
  }

  override fun parityImportGethAccounts(gethAddresses: ArrayList<String>?): Request<*, ParityAddressesResponse> {
    TODO("not implemented")
  }

  override fun dbGetString(databaseName: String?, keyName: String?): Request<*, DbGetString> {
    TODO("not implemented")
  }

  override fun parityDeriveAddressIndex(
    accountId: String?,
    password: String?,
    indicesType: MutableList<Derivation>?,
    toSave: Boolean
  ): Request<*, ParityDeriveAddress> {
    TODO("not implemented")
  }

  override fun ethGetFilterChanges(filterId: BigInteger?): Request<*, EthLog> {
    TODO("not implemented")
  }

  override fun shhGetMessages(filterId: BigInteger?): Request<*, ShhMessages> {
    TODO("not implemented")
  }

  override fun ethGetWork(): Request<*, EthGetWork> {
    TODO("not implemented")
  }

  override fun dbPutHex(databaseName: String?, keyName: String?, dataToStore: String?): Request<*, DbPutHex> {
    TODO("not implemented")
  }

  override fun ethCompileSerpent(sourceCode: String?): Request<*, EthCompileSerpent> {
    TODO("not implemented")
  }

  override fun personalSendTransaction(transaction: Transaction?, password: String?): Request<*, EthSendTransaction> {
    TODO("not implemented")
  }

  override fun parityRemoveAddress(accountId: String?): Request<*, BooleanResponse> {
    TODO("not implemented")
  }

  override fun shhNewFilter(shhFilter: ShhFilter?): Request<*, ShhNewFilter> {
    TODO("not implemented")
  }

  override fun ethGetUncleCountByBlockHash(blockHash: String?): Request<*, EthGetUncleCountByBlockHash> {
    TODO("not implemented")
  }

  override fun traceReplayTransaction(hash: String?, traceTypes: MutableList<String>?): Request<*, ParityFullTraceResponse> {
    TODO("not implemented")
  }

  override fun ethGetBlockTransactionCountByHash(blockHash: String?): Request<*, EthGetBlockTransactionCountByHash> {
    TODO("not implemented")
  }

  override fun netPeerCount(): Request<*, NetPeerCount> {
    TODO("not implemented")
  }

  override fun ethGetTransactionByHash(transactionHash: String?): Request<*, EthTransaction> {
    TODO("not implemented")
  }

  override fun ethSign(address: String?, sha3HashOfDataToSign: String?): Request<*, EthSign> {
    TODO("not implemented")
  }

  override fun shhPost(shhPost: ShhPost?): Request<*, org.web3j.protocol.core.methods.response.ShhPost> {
    TODO("not implemented")
  }

  override fun ethSendTransaction(transaction: Transaction?): Request<*, EthSendTransaction> {
    TODO("not implemented")
  }

  override fun parityChangePassword(accountId: String?, oldPassword: String?, newPassword: String?): Request<*, BooleanResponse> {
    TODO("not implemented")
  }

  override fun parityListAccounts(quantity: BigInteger?, accountId: String?, blockParameter: DefaultBlockParameter?): Request<*, ParityAddressesResponse> {
    TODO("not implemented")
  }

  override fun parityDeriveAddressHash(accountId: String?, password: String?, hashType: Derivation?, toSave: Boolean): Request<*, ParityDeriveAddress> {
    TODO("not implemented")
  }

  override fun web3ClientVersion(): Request<*, Web3ClientVersion> {
    TODO("not implemented")
  }

  override fun transactionFlowable(): Flowable<org.web3j.protocol.core.methods.response.Transaction> {
    TODO("not implemented")
  }

  override fun shhHasIdentity(identityAddress: String?): Request<*, ShhHasIdentity> {
    TODO("not implemented")
  }

  override fun ethGetBlockByNumber(defaultBlockParameter: DefaultBlockParameter?, returnFullTransactionObjects: Boolean): Request<*, EthBlock> {
    TODO("not implemented")
  }

  override fun ethEstimateGas(transaction: Transaction?): Request<*, EthEstimateGas> {
    TODO("not implemented")
  }

  override fun netListening(): Request<*, NetListening> {
    TODO("not implemented")
  }

  override fun ethSubmitHashrate(hashrate: String?, clientId: String?): Request<*, EthSubmitHashrate> {
    TODO("not implemented")
  }

  override fun ethGetLogs(ethFilter: EthFilter?): Request<*, EthLog> {
    TODO("not implemented")
  }

  override fun ethGetBlockByHash(blockHash: String?, returnFullTransactionObjects: Boolean): Request<*, EthBlock> {
    TODO("not implemented")
  }

  override fun parityGetDappDefaultAddress(dAppId: String?): Request<*, ParityDefaultAddressResponse> {
    TODO("not implemented")
  }

  override fun ethGetCode(address: String?, defaultBlockParameter: DefaultBlockParameter?): Request<*, EthGetCode> {
    TODO("not implemented")
  }

  override fun pendingTransactionFlowable(): Flowable<org.web3j.protocol.core.methods.response.Transaction> {
    TODO("not implemented")
  }

  override fun ethCompileLLL(sourceCode: String?): Request<*, EthCompileLLL> {
    TODO("not implemented")
  }

  override fun parityGetNewDappsAddresses(): Request<*, ParityAddressesResponse> {
    TODO("not implemented")
  }

  override fun ethGetBlockTransactionCountByNumber(defaultBlockParameter: DefaultBlockParameter?): Request<*, EthGetBlockTransactionCountByNumber> {
    TODO("not implemented")
  }

  override fun ethNewPendingTransactionFilter(): Request<*, org.web3j.protocol.core.methods.response.EthFilter> {
    TODO("not implemented")
  }

  override fun personalNewAccount(password: String?): Request<*, NewAccountIdentifier> {
    TODO("not implemented")
  }

  override fun paritySetNewDappsDefaultAddress(defaultAddress: String?): Request<*, BooleanResponse> {
    TODO("not implemented")
  }

  override fun ethGetStorageAt(address: String?, position: BigInteger?, defaultBlockParameter: DefaultBlockParameter?): Request<*, EthGetStorageAt> {
    TODO("not implemented")
  }

  override fun replayPastTransactionsFlowable(
    startBlock: DefaultBlockParameter?,
    endBlock: DefaultBlockParameter?
  ): Flowable<org.web3j.protocol.core.methods.response.Transaction> {
    TODO("not implemented")
  }

  override fun replayPastTransactionsFlowable(startBlock: DefaultBlockParameter?): Flowable<org.web3j.protocol.core.methods.response.Transaction> {
    TODO("not implemented")
  }

  override fun personalListAccounts(): Request<*, PersonalListAccounts> {
    TODO("not implemented")
  }

  override fun parityGetDappAddresses(dAppId: String?): Request<*, ParityAddressesResponse> {
    TODO("not implemented")
  }

  override fun ethMining(): Request<*, EthMining> {
    TODO("not implemented")
  }

  override fun ethGetUncleByBlockNumberAndIndex(defaultBlockParameter: DefaultBlockParameter?, transactionIndex: BigInteger?): Request<*, EthBlock> {
    TODO("not implemented")
  }

  override fun paritySetDappAddresses(dAppId: String?, availableAccountIds: ArrayList<String>?): Request<*, BooleanResponse> {
    TODO("not implemented")
  }

  override fun paritySignMessage(accountId: String?, password: String?, hexMessage: String?): Request<*, PersonalSign> {
    TODO("not implemented")
  }

  override fun dbGetHex(databaseName: String?, keyName: String?): Request<*, DbGetHex> {
    TODO("not implemented")
  }

  override fun parityListGethAccounts(): Request<*, ParityAddressesResponse> {
    TODO("not implemented")
  }
}
