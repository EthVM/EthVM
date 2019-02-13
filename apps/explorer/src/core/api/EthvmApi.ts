import { Block, PendingTx, Tx, Uncle } from '@app/core/models'
import {
  AddressBalance,
  AddressMetadata,
  BlockMetrics,
  Contract,
  Quote,
  Statistic,
  Token,
  TokenTransfer,
  TokenExchangeRate,
  ProcessingMetadata
} from 'ethvm-common'

export interface EthvmApi {
  // Address
  getAddressBalance(address: string): Promise<AddressBalance | null>
  getAddressMetadata(address: string): Promise<AddressMetadata | null>
  getAddressAllTokensOwned(address: string): Promise<Token[]>
  getAddressAmountTokensOwned(address: string): Promise<number>
  getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]>
  getAddressTokenTransfersByHolder(address: string, holder: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]>

  // Blocks
  getBlock(hash: string): Promise<Block | null>
  getBlocks(limit: number, page: number, fromBlock: number): Promise<Block[]>
  getBlockByNumber(no: number): Promise<Block | null>
  getBlocksMinedOfAddress(address: string, limit: number, page: number): Promise<Block[]>
  getTotalNumberOfBlocks(): Promise<number>

  // Block Metrics
  getBlockMetric(hash: string): Promise<BlockMetrics | null>
  getBlockMetrics(limit: number, page: number): Promise<BlockMetrics[]>

  // Contracts
  getContract(address: string): Promise<Contract | null>
  getContractsCreatedBy(address: string, limit: number, page: number): Promise<Contract[]>

  // Exchanges
  getExchangeRateQuote(symbol: string, to: string): Promise<Quote>
  getTokenExchangeRates(limit: number, page: number): Promise<TokenExchangeRate[]>
  getTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRate | null>
  getTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRate | null>

  // Pending Txs
  getPendingTxs(limit: number, page: number): Promise<PendingTx[]>
  getPendingTxsOfAddress(address: string, filter: string, limit: number, page: number): Promise<PendingTx[]>
  getNumberOfPendingTxsOfAddress(address: string): Promise<number>
  getTotalNumberOfPendingTxs(): Promise<number>

  // Txs
  getTx(hash: string): Promise<Tx | null>
  getTxs(limit: number, order: string, fromBlock: number): Promise<Tx[]>
  getTxsOfBlock(hash: string): Promise<Tx[]>
  getTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<Tx[]>
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

  // Processing Metadata
  getProcessingMetadata(id: string): Promise<ProcessingMetadata | null>
}
