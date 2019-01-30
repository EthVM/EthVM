import { AddressBalance, AddressMetadata, Block, Contract, PendingTx, Quote, Statistic, TokenTransfer, Tx, Token, Uncle } from 'ethvm-common'

export interface EthvmApi {
  // Address
  getAddressBalance(address: string): Promise<AddressBalance | null>
  getAddressMetadata(address: string): Promise<AddressMetadata | null>
  getAddressAllTokensOwned(address: string): Promise<Token[]>
  getAddressAmountTokensOwned(address: string): Promise<number>
  getAddressTokensTransfers(address: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]>

  // Blocks
  getBlock(hash: string): Promise<Block | null>
  getBlocks(limit: number, page: number): Promise<Block[]>
  getBlockByNumber(no: number): Promise<Block | null>
  getBlocksMinedOfAddress(address: string, limit: number, page: number): Promise<Block[]>

  // Contracts
  getContract(address: string): Promise<Contract | null>
  getContractsCreatedBy(address: string, limit: number, page: number): Promise<Contract[]>

  // Exchanges
  getExchangeRateQuote(symbol: string, to: string): Promise<Quote>

  // Pending Txs
  getPendingTxs(limit: number, page: number): Promise<PendingTx[]>
  getPendingTxsOfAddress(address: string, filter: string, limit: number, page: number): Promise<PendingTx[]>

  // Txs
  getTx(hash: string): Promise<Tx | null>
  getTxs(limit: number, page: number): Promise<Tx[]>
  getTxsOfBlock(hash: string): Promise<Tx[]>
  getTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<Tx[]>

  // Uncles
  getUncle(hash: string): Promise<Uncle | null>
  getUncles(limit: number, page: number): Promise<Uncle[]>

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
}
