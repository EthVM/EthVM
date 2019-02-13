import { EthvmApi } from '@app/core/api'
import { Block, PendingTx, Tx, Uncle } from '@app/core/models'
import {
  AddressBalance,
  AddressMetadata,
  BlockMetrics,
  Contract,
  Events,
  Quote,
  Statistic,
  Token,
  TokenTransfer,
  TokenExchangeRate,
  ProcessingMetadata
} from 'ethvm-common'

export class EthvmSocketIoApi implements EthvmApi {
  constructor(private readonly io: SocketIOClient.Socket) {}

  // ------------------------------------------------------------------------------------
  // Address
  // ------------------------------------------------------------------------------------

  public getAddressBalance(address: string): Promise<AddressBalance | null> {
    return this.promisify(Events.getAddressBalance, { address })
  }

  public getAddressMetadata(address: string): Promise<AddressMetadata | null> {
    return this.promisify(Events.getAddressMetadata, { address })
  }

  public getAddressAllTokensOwned(address: string): Promise<Token[]> {
    return this.promisify(Events.getAddressAllTokensOwned, { address })
  }

  public getAddressAmountTokensOwned(address: string): Promise<number> {
    return this.promisify(Events.getAddressAmountTokensOwned, { address })
  }

  getAddressTokenTransfers(address: string, limit: number = 100, page: number = 0): Promise<TokenTransfer[]> {
    return this.promisify(Events.getAddressTokenTransfers, { address, limit, page })
  }

  getAddressTokenTransfersByHolder(address: string, holder: string, filter: string = 'all', limit: number = 100, page: number = 0): Promise<TokenTransfer[]> {
    return this.promisify(Events.getAddressTokenTransfersByHolder, { address, holder, filter, limit, page })
  }

  // ------------------------------------------------------------------------------------
  // Blocks
  // ------------------------------------------------------------------------------------

  public getBlock(hash: string): Promise<Block | null> {
    return this.promisify(Events.getBlock, { hash }).then(raw => (raw !== null ? new Block(raw) : null))
  }

  public getBlocks(limit: number = 100, page: number = 0, fromBlock: number = -1): Promise<Block[]> {
    return this.promisify(Events.getBlocks, { limit, page, fromBlock }).then(raw => raw.map(rawBlock => new Block(rawBlock)))
  }

  public getBlockByNumber(no: number): Promise<Block | null> {
    return this.promisify(Events.getBlockByNumber, { number: no }).then(raw => (raw !== null ? new Block(raw) : null))
  }

  public getBlocksMinedOfAddress(address: string, limit: number = 100, page: number = 0): Promise<Block[]> {
    return this.promisify(Events.getBlocksMined, { address, limit, page }).then(raw => raw.map(rawBlock => new Block(rawBlock)))
  }

  public getTotalNumberOfBlocks(): Promise<number> {
    return this.promisify(Events.getTotalNumberOfBlocks, {})
  }

  // ------------------------------------------------------------------------------------
  // Blocks
  // ------------------------------------------------------------------------------------

  public getBlockMetric(hash: string): Promise<BlockMetrics | null> {
    return this.promisify(Events.getBlockMetric, { hash })
  }

  public getBlockMetrics(limit: number, page: number): Promise<BlockMetrics[]> {
    return this.promisify(Events.getBlockMetrics, { limit, page })
  }

  // ------------------------------------------------------------------------------------
  // Contracts
  // ------------------------------------------------------------------------------------

  public getContract(address: string): Promise<Contract | null> {
    return this.promisify(Events.getContract, { address })
  }

  public getContractsCreatedBy(address: string): Promise<Contract[]> {
    return this.promisify(Events.getContractsCreatedBy, { address })
  }

  // ------------------------------------------------------------------------------------
  // Exchanges
  // ------------------------------------------------------------------------------------

  public getExchangeRateQuote(symbol: string, to: string): Promise<Quote> {
    return this.promisify(Events.getExchangeRates, { symbol, to })
  }

  public getTokenExchangeRates(limit: number, page: number): Promise<TokenExchangeRate[]> {
    return this.promisify(Events.getTokenExchangeRates, { limit, page })
  }

  public getTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRate | null> {
    return this.promisify(Events.getTokenExchangeRateBySymbol, { symbol })
  }

  public getTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRate | null> {
    return this.promisify(Events.getTokenExchangeRateByAddress, { address })
  }

  // ------------------------------------------------------------------------------------
  // Pending Txs
  // ------------------------------------------------------------------------------------

  public getPendingTxs(limit: number = 100, page: number = 0): Promise<PendingTx[]> {
    return this.promisify(Events.getPendingTxs, { limit, page }).then(raw => raw.map(rawPTx => new PendingTx(rawPTx)))
  }

  public getPendingTxsOfAddress(address: string, filter = 'all', limit: number = 100, page: number = 0): Promise<PendingTx[]> {
    return this.promisify(Events.getPendingTxsOfAddress, { address, filter, limit, page }).then(raw => raw.map(rawPTx => new PendingTx(rawPTx)))
  }

  public getNumberOfPendingTxsOfAddress(address: string): Promise<number> {
    return this.promisify(Events.getNumberOfPendingTxsOfAddress, { address })
  }

  public getTotalNumberOfPendingTxs(): Promise<number> {
    return this.promisify(Events.getTotalNumberOfPendingTxs, {})
  }

  // ------------------------------------------------------------------------------------
  // Txs
  // ------------------------------------------------------------------------------------

  public getTx(hash: string): Promise<Tx | null> {
    return this.promisify(Events.getTx, { hash }).then(raw => (raw !== null ? new Tx(raw) : null))
  }

  public getTxs(limit: number = 100, order: string = 'desc', fromBlock: number = -1): Promise<Tx[]> {
    return this.promisify(Events.getTxs, { limit,  order, fromBlock }).then(raw => raw.map(rawTx => new Tx(rawTx)))
  }

  public getTxsOfBlock(hash: string): Promise<Tx[]> {
    return this.promisify(Events.getBlockTxs, { hash }).then(raw => raw.map(rawTx => new Tx(rawTx)))
  }

  public getTxsOfAddress(address: string, filter: string = 'all', limit: number = 100, page: number = 0): Promise<Tx[]> {
    return this.promisify(Events.getAddressTxs, { address, filter, limit, page }).then(raw => raw.map(rawTx => new Tx(rawTx)))
  }

  public getTotalNumberOfTxs(): Promise<number> {
    return this.promisify(Events.getTotalNumberOfTxs, {})
  }

  // ------------------------------------------------------------------------------------
  // Uncles
  // ------------------------------------------------------------------------------------

  public getUncles(limit: number = 100, page: number = 0, fromUncle: number = -1): Promise<Uncle[]> {
    return this.promisify(Events.getUncles, { limit, page, fromUncle }).then(raw => raw.map(rawUncle => new Uncle(rawUncle)))
  }

  public getUncle(hash: string): Promise<Uncle | null> {
    return this.promisify(Events.getUncle, { hash }).then(raw => (raw !== null ? new Uncle(raw) : null))
  }

  public getTotalNumberOfUncles(): Promise<number> {
    return this.promisify(Events.getTotalNumberOfUncles, {})
  }

  // ------------------------------------------------------------------------------------
  // Statistics
  // ------------------------------------------------------------------------------------

  public getAverageBlockTimeStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageBlockTimeStats, { duration })
  }

  public getAverageDifficultyStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageDifficultyStats, { duration })
  }

  public getAverageGasLimitStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageGasLimitStats, { duration })
  }

  public getAverageGasPriceStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageGasPriceStats, { duration })
  }

  public getAverageHashRateStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageHashRateStats, { duration })
  }

  public getAverageMinerRewardsStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageMinerRewardsStats, { duration })
  }

  public getAverageTxFeeStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageTxFeeStats, { duration })
  }

  public getFailedTxStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getFailedTxStats, { duration })
  }

  public getSuccessfulTxStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getSuccessfulTxStats, { duration })
  }

  // ------------------------------------------------------------------------------------
  // Search
  // ------------------------------------------------------------------------------------

  public search(input: string): Promise<any> {
    return this.promisify(Events.search, { hash: input })
  }

  // ------------------------------------------------------------------------------------
  // Processing Metadata
  // ------------------------------------------------------------------------------------
  public getProcessingMetadata(ev: string): Promise<ProcessingMetadata | null> {
    return this.promisify(Events.getProcessingMetadata, { id: ev })
  }

  // ------------------------------------------------------------------------------------
  // Private Methods
  // ------------------------------------------------------------------------------------
  private promisify(event: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.io.emit(event, payload, (err, result) => (err ? reject(err) : resolve(result)))
    })
  }
}
