import { EthvmApi, EthvmApolloApi, EthvmSocketIoApi } from '@app/core/api'
import { Block, PendingTx, SimpleBlock, SimpleTx, Tx, Uncle } from '@app/core/models'
import {
  AddressBalance,
  AddressMetadata,
  BlockMetrics,
  Contract,
  ProcessingMetadata,
  Quote,
  Statistic,
  Token,
  TokenExchangeRate,
  TokenTransfer
} from 'ethvm-common'

export class EthvmMigrationApi implements EthvmApi {
  constructor(private readonly apolloApi: EthvmApolloApi, private readonly socketIoApi: EthvmSocketIoApi) {}

  // ------------------------------------------------------------------------------------
  // Address
  // ------------------------------------------------------------------------------------

  public getAddressBalance(address: string): Promise<AddressBalance> {
    return this.socketIoApi.getAddressBalance(address)
  }

  public getAddressMetadata(address: string): Promise<AddressMetadata> {
    return this.socketIoApi.getAddressMetadata(address)
  }

  public getAddressAllTokensOwned(address: string): Promise<Token[]> {
    return this.socketIoApi.getAddressAllTokensOwned(address)
  }

  public getAddressAmountTokensOwned(address: string): Promise<number> {
    return this.socketIoApi.getAddressAmountTokensOwned(address)
  }

  public getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]> {
    return this.socketIoApi.getAddressTokenTransfers(address, limit, page)
  }

  public getAddressTokenTransfersByHolder(address: string, holder: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]> {
    return this.socketIoApi.getAddressTokenTransfersByHolder(address, holder, filter, limit, page)
  }

  // ------------------------------------------------------------------------------------
  // Blocks
  // ------------------------------------------------------------------------------------

  public getBlock(hash: string): Promise<Block> {
    return this.apolloApi.getBlock(hash)
  }

  public getBlocks(format: string, limit: number, page: number, fromBlock: number): Promise<Block[] | SimpleBlock[]> {
    return this.apolloApi.getBlocks(format, limit, page, fromBlock)
  }

  public getBlockByNumber(no: number): Promise<Block> {
    return this.apolloApi.getBlockByNumber(no)
  }

  public getBlocksMinedOfAddress(address: string, limit: number, page: number): Promise<SimpleBlock[]> {
    return this.apolloApi.getBlocksMinedOfAddress(address, limit, page)
  }

  public getTotalNumberOfBlocks(): Promise<number> {
    return this.apolloApi.getTotalNumberOfBlocks()
  }

  // ------------------------------------------------------------------------------------
  // Blocks Metrics
  // ------------------------------------------------------------------------------------

  public getBlockMetric(hash: string): Promise<BlockMetrics> {
    return this.socketIoApi.getBlockMetric(hash)
  }

  public getBlockMetrics(limit: number, page: number): Promise<BlockMetrics[]> {
    return this.socketIoApi.getBlockMetrics(limit, page)
  }

  // ------------------------------------------------------------------------------------
  // Contracts
  // ------------------------------------------------------------------------------------

  public getContract(address: string): Promise<Contract> {
    return this.socketIoApi.getContract(address)
  }

  public getContractsCreatedBy(address: string): Promise<Contract[]> {
    return this.socketIoApi.getContractsCreatedBy(address)
  }

  // ------------------------------------------------------------------------------------
  // Exchanges
  // ------------------------------------------------------------------------------------

  public getExchangeRateQuote(symbol: string, to: string): Promise<Quote> {
    return this.socketIoApi.getExchangeRateQuote(symbol, to)
  }

  public getTokenExchangeRates(filter: string, limit: number, page: number): Promise<TokenExchangeRate[]> {
    return this.socketIoApi.getTokenExchangeRates(filter, limit, page)
  }

  public getTotalNumberOfTokenExchangeRates(): Promise<number> {
    return this.socketIoApi.getTotalNumberOfTokenExchangeRates()
  }

  public getTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRate> {
    return this.socketIoApi.getTokenExchangeRateBySymbol(symbol)
  }

  public getTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRate> {
    return this.socketIoApi.getTokenExchangeRateByAddress(address)
  }

  // ------------------------------------------------------------------------------------
  // Pending Txs
  // ------------------------------------------------------------------------------------

  public getPendingTxs(limit: number, page: number): Promise<PendingTx[]> {
    throw new Error('Method not implemented.')
  }

  public getPendingTxsOfAddress(address: string, filter: string, limit: number, page: number): Promise<PendingTx[]> {
    throw new Error('Method not implemented.')
  }

  public getNumberOfPendingTxsOfAddress(address: string): Promise<number> {
    throw new Error('Method not implemented.')
  }

  public getTotalNumberOfPendingTxs(): Promise<number> {
    throw new Error('Method not implemented.')
  }

  // ------------------------------------------------------------------------------------
  // Txs
  // ------------------------------------------------------------------------------------

  public getTx(hash: string): Promise<Tx> {
    return this.apolloApi.getTx(hash)
  }

  public getTxs(format: string, limit: number, order: string, fromBlock: number): Promise<Tx[] | SimpleTx[]> {
    return this.apolloApi.getTxs(format, limit, order, fromBlock)
  }

  public getTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<Tx[]> {
    return this.apolloApi.getTxsOfAddress(hash, filter, limit, page)
  }

  public getTotalNumberOfTxs(): Promise<number> {
    return this.apolloApi.getTotalNumberOfTxs()
  }

  // ------------------------------------------------------------------------------------
  // Uncles
  // ------------------------------------------------------------------------------------

  public getUncle(hash: string): Promise<Uncle> {
    return this.socketIoApi.getUncle(hash)
  }

  public getUncles(limit: number, page: number, fromUncle: number): Promise<Uncle[]> {
    return this.socketIoApi.getUncles(limit, page, fromUncle)
  }

  public getTotalNumberOfUncles(): Promise<number> {
    return this.socketIoApi.getTotalNumberOfUncles()
  }

  // ------------------------------------------------------------------------------------
  // Statistics
  // ------------------------------------------------------------------------------------

  public getAverageBlockTimeStats(duration: string): Promise<Statistic[]> {
    return this.socketIoApi.getAverageBlockTimeStats(duration)
  }

  public getAverageDifficultyStats(duration: string): Promise<Statistic[]> {
    return this.socketIoApi.getAverageDifficultyStats(duration)
  }

  public getAverageGasLimitStats(duration: string): Promise<Statistic[]> {
    return this.socketIoApi.getAverageGasLimitStats(duration)
  }

  public getAverageGasPriceStats(duration: string): Promise<Statistic[]> {
    return this.socketIoApi.getAverageGasPriceStats(duration)
  }

  public getAverageHashRateStats(duration: string): Promise<Statistic[]> {
    return this.socketIoApi.getAverageHashRateStats(duration)
  }

  public getAverageMinerRewardsStats(duration: string): Promise<Statistic[]> {
    return this.socketIoApi.getAverageMinerRewardsStats(duration)
  }

  public getAverageTxFeeStats(duration: string): Promise<Statistic[]> {
    return this.socketIoApi.getAverageTxFeeStats(duration)
  }

  public getFailedTxStats(duration: string): Promise<Statistic[]> {
    return this.socketIoApi.getFailedTxStats(duration)
  }

  public getSuccessfulTxStats(duration: string): Promise<Statistic[]> {
    return this.socketIoApi.getSuccessfulTxStats(duration)
  }

  // ------------------------------------------------------------------------------------
  // Search
  // ------------------------------------------------------------------------------------

  public search(input: string): Promise<any> {
    return this.socketIoApi.search(input)
  }

  // ------------------------------------------------------------------------------------
  // Processing Metadata
  // ------------------------------------------------------------------------------------

  public getProcessingMetadata(id: string): Promise<ProcessingMetadata> {
    return this.socketIoApi.getProcessingMetadata(id)
  }
}
