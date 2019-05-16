import {
  Account,
  Block,
  CoinExchangeRate,
  Contract,
  PendingTx,
  SimpleBlock,
  SimpleTx,
  Statistic,
  Token,
  TokenExchangeRate,
  TokenHolder,
  Transfer,
  Tx,
  Uncle
} from '@app/core/models'
import BigNumber from 'bignumber.js'

export interface EthvmApi {
  // Address
  getAccount(address: string): Promise<Account | null>
  getAddressAllTokensOwned(address: string): Promise<Token[]>
  getAddressAmountTokensOwned(address: string): Promise<number>
  getInternalTransactionsByAddress(address: string, limit?: number, page?: number): Promise<{ items: Transfer[]; totalCount: string }>

  // Blocks
  getBlock(hash: string): Promise<Block | null>
  getBlocks(limit: number, page: number, fromBlock: number): Promise<SimpleBlock[]>
  getBlockByNumber(no: BigNumber): Promise<Block | null>
  getBlocksMinedOfAddress(address: string, limit: number, page: number): Promise<{ items: SimpleBlock[]; totalCount: number }>
  getTotalNumberOfBlocks(): Promise<number>

  // Block Metrics
  // getBlockMetric(hash: string): Promise<BlockMetrics | null>
  // getBlockMetrics(limit: number, page: number): Promise<BlockMetrics[]>

  // Contracts
  getContract(address: string): Promise<Contract | null>
  getContractsCreatedBy(address: string, limit: number, page: number): Promise<{ items: Contract[]; totalCount: number }>

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
  getTokenHolders(address: string, limit?: number, page?: number): Promise<{ items: TokenHolder[]; totalCount: number }>
  getTokenTransfersByContractAddress(address: string, limit?: number, page?: number): Promise<{ items: Transfer[]; totalCount: string }>
  getTokenTransfersByContractAddressForHolder(
    address: string,
    holder: string,
    filter?: string,
    limit?: number,
    page?: number
  ): Promise<{ items: Transfer[]; totalCount: string }>

  // Txs
  getTx(hash: string): Promise<Tx | null>
  getTxs(limit: number, order: string, fromBlock: number): Promise<SimpleTx[]>
  getTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<SimpleTx[]>
  getTotalNumberOfTxs(): Promise<number>

  // Search
  search(hash: string): Promise<any>

  // Processing Metadata
  // getProcessingMetadata(id: string): Promise<ProcessingMetadata | null>

  // Subscriptions
  // observable<T>(query): Observable<T>
}
