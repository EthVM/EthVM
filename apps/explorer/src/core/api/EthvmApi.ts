import {
  Account,
  Block,
  BlockMetrics,
  Contract,
  PendingTx,
<<<<<<< HEAD
  ProcessingMetadata,
  CoinExchangeRate,
=======
  Quote,
>>>>>>> develop
  SimpleBlock,
  SimpleTx,
  Statistic,
  Token,
  TokenExchangeRate,
  TokenTransfer,
  Transfer,
  Tx,
  Uncle
} from '@app/core/models'
import { Observable } from 'apollo-client/util/Observable'

export interface EthvmApi {
  // Address
  getAccount(address: string): Promise<Account | null>
  getAddressAllTokensOwned(address: string): Promise<Token[]>
  getAddressAmountTokensOwned(address: string): Promise<number>
  getInternalTransactionsByAddress(address: string, limit?: number, page?: number): Promise<{ items: Transfer[]; totalCount: number }>

  // Blocks
  getBlock(hash: string): Promise<Block | null>
  getBlocks(limit: number, page: number, fromBlock: number): Promise<SimpleBlock[]>
  getBlockByNumber(no: number): Promise<Block | null>
  getBlocksMinedOfAddress(address: string, limit: number, page: number): Promise<SimpleBlock[]>
  getTotalNumberOfBlocks(): Promise<number>

  // Block Metrics
  getBlockMetric(hash: string): Promise<BlockMetrics | null>
  getBlockMetrics(limit: number, page: number): Promise<BlockMetrics[]>

  // Contracts
  getContract(address: string): Promise<Contract | null>
  getContractsCreatedBy(address: string, limit: number, page: number): Promise<Contract[]>

  // Exchanges
  getExchangeRateQuote(pair: string): Promise<CoinExchangeRate>
  getTokenExchangeRates(filter: string, limit: number, page: number): Promise<TokenExchangeRate[]>
  getTotalNumberOfTokenExchangeRates(): Promise<number>
  getTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRate | null>
  getTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRate | null>
  getHolderDetails(address: string, holderAddress: string): Promise<any>

  // Pending Txs
  getPendingTxs(limit: number, page: number): Promise<PendingTx[]>
  getPendingTxsOfAddress(address: string, filter: string, limit: number, page: number): Promise<PendingTx[]>
  getNumberOfPendingTxsOfAddress(address: string): Promise<number>
  getTotalNumberOfPendingTxs(): Promise<number>

  // Tokens
  getTokenHolders(address: string, limit?: number, page?: number): Promise<any>
  getTokenTransfersByContractAddress(address: string, limit?: number, page?: number): Promise<{ items: Transfer[]; totalCount: number }>
  getTokenTransfersByContractAddressForHolder(address: string, holder: string, filter?: string, limit?: number, page?: number): Promise<TokenTransfer[]>

  // Txs
  getTx(hash: string): Promise<Tx | null>
  getTxs(limit: number, order: string, fromBlock: number): Promise<SimpleTx[]>
  getTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<SimpleTx[]>
  getTotalNumberOfTxs(): Promise<number>

  // Uncles
  getUncle(hash: string): Promise<Uncle | null>
  getUncles(limit: number, page: number, fromUncle: number): Promise<Uncle[]>
  getTotalNumberOfUncles(): Promise<number>

  // Statistics
  getAverageBlockTimeStats(duration: string): Promise<Statistic[]>
  getAverageDifficultyStats(duration: string): Promise<Statistic[]>
  getAverageGasLimitStats(duration: string): Promise<Statistic[]>
  getAverageGasPriceStats(duration: string): Promise<Statistic[]>
  getAverageHashRateStats(duration: string): Promise<Statistic[]>
  getAverageMinerRewardsStats(duration: string): Promise<Statistic[]>
  getAverageTxFeeStats(duration: string): Promise<Statistic[]>
  getFailedTxStats(duration: string): Promise<Statistic[]>
  getSuccessfulTxStats(duration: string): Promise<Statistic[]>

  // Search
  search(hash: string): Promise<any>

  // Subscriptions
  observable<T>(query): Observable<T>
}
