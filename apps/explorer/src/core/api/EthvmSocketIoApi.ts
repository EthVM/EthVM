import { EthvmApi } from '@app/core/api'
import { AddressBalance, AddressMetadata, Block, Contract, Events, PendingTx, Quote, Statistic, TokenTransfer, Tx, Token, Uncle } from 'ethvm-common'

export class EthvmSocketIoApi implements EthvmApi {

  constructor(private readonly io: SocketIOClient.Socket) {}

  // ------------------------------------------------------------------------------------
  // Address
  // ------------------------------------------------------------------------------------

  getAddressBalance(address: string): Promise<AddressBalance | null> {
    return this.promisify(Events.getAddressBalance, { address })
  }

  getAddressMetadata(address: string): Promise<AddressMetadata | null> {
    return this.promisify(Events.getAddressMetadata, { address })
  }

  getAddressAllTokensOwned(address: string): Promise<Token[]> {
    return this.promisify(Events.getAddressAllTokensOwned, { address })
  }

  getAddressAmountTokensOwned(address: string): Promise<number> {
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

  getBlock(hash: string): Promise<Block | null> {
    return this.promisify(Events.getBlock, { hash })
  }

  getBlocks(limit: number = 100, page: number = 0): Promise<Block[]> {
    return this.promisify(Events.getBlocks, { limit, page })
  }

  getBlockByNumber(no: number): Promise<Block | null> {
    return this.promisify(Events.getBlockByNumber, { no })
  }

  getBlocksMinedOfAddress(address: string, limit: number = 100, page: number = 0): Promise<Block[]> {
    return this.promisify(Events.getBlocksMined, { address, limit, page })
  }

  getTotalNumberOfBlocks(): Promise<number> {
    return this.promisify(Events.getTotalNumberOfBlocks, {})
  }

  // ------------------------------------------------------------------------------------
  // Contracts
  // ------------------------------------------------------------------------------------

  getContract(address: string): Promise<Contract | null> {
    return this.promisify(Events.getContract, { address })
  }

  getContractsCreatedBy(address: string): Promise<Contract[]> {
    return this.promisify(Events.getContractsCreatedBy, { address })
  }

  // ------------------------------------------------------------------------------------
  // Exchanges
  // ------------------------------------------------------------------------------------

  getExchangeRateQuote(symbol: string, to: string): Promise<Quote> {
    return this.promisify(Events.getExchangeRates, { symbol, to })
  }

  // ------------------------------------------------------------------------------------
  // Pending Txs
  // ------------------------------------------------------------------------------------

  getPendingTxs(limit: number = 100, page: number = 0): Promise<PendingTx[]> {
    return this.promisify(Events.getPendingTxs, { limit, page })
  }

  getPendingTxsOfAddress(address: string, filter = 'all', limit: number = 100, page: number = 0): Promise<PendingTx[]> {
    return this.promisify(Events.getPendingTxsOfAddress, { address, filter, limit, page })
  }

  getNumberOfPendingTxsOfAddress(address: string): Promise<number> {
    return this.promisify(Events.getNumberOfPendingTxsOfAddress, { address })
  }

  getTotalNumberOfPendingTxs(): Promise<number> {
    return this.promisify(Events.getTotalNumberOfPendingTxs, {})
  }

  // ------------------------------------------------------------------------------------
  // Txs
  // ------------------------------------------------------------------------------------

  getTx(hash: string): Promise<Tx | null> {
    return this.promisify(Events.getTx, { hash })
  }

  getTxs(limit: number = 100, page: number = 0): Promise<Tx[]> {
    return this.promisify(Events.getTxs, { limit, page })
  }

  getTxsOfBlock(hash: string): Promise<Tx[]> {
    return this.promisify(Events.getBlockTxs, { hash })
  }

  getTxsOfAddress(address: string, filter: string = 'all', limit: number = 100, page: number = 0): Promise<Tx[]> {
    return this.promisify(Events.getAddressTxs, { address, filter, limit, page })
  }

  // ------------------------------------------------------------------------------------
  // Uncles
  // ------------------------------------------------------------------------------------

  getUncles(limit: number = 100, page: number = 0): Promise<Uncle[]> {
    return this.promisify(Events.getUncles, { limit, page })
  }

  getUncle(hash: string): Promise<Uncle | null> {
    return this.promisify(Events.getUncle, { hash })
  }

  getTotalNumberOfUncles(): Promise<number> {
    return this.promisify(Events.getTotalNumberOfUncles, {})
  }

  // ------------------------------------------------------------------------------------
  // Statistics
  // ------------------------------------------------------------------------------------

  getAverageBlockTimeStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageBlockTimeStats, { duration })
  }

  getAverageDifficultyStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageDifficultyStats, { duration })
  }

  getAverageGasLimitStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageGasLimitStats, { duration })
  }

  getAverageGasPriceStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageGasPriceStats, { duration })
  }

  getAverageHashRateStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageHashRateStats, { duration })
  }

  getAverageMinerRewardsStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageMinerRewardsStats, { duration })
  }

  getAverageTxFeeStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getAverageTxFeeStats, { duration })
  }

  getFailedTxStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getFailedTxStats, { duration })
  }

  getSuccessfulTxStats(duration: string): Promise<Statistic[]> {
    return this.promisify(Events.getSuccessfulTxStats, { duration })
  }

  // ------------------------------------------------------------------------------------
  // Uncles
  // ------------------------------------------------------------------------------------

  search(input: string): Promise<any> {
    return this.promisify(Events.search, { hash: input })
  }

  private promisify(event: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.io.emit(event, payload, (err, result) => (err ? reject(err) : resolve(result)))
    })
  }
}
