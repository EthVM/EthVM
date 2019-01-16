import { AddressBalance, Block, Uncle, Tx, PendingTx, Statistic } from 'ethvm-common'

export interface EthvmApi {
  // Balances
  getAddressBalance(hash: string): Promise<AddressBalance | null>

  // Blocks
  getBlock(hash: string): Promise<Block | null>
  getBlocks(limit: number, page: number): Promise<Block[]>
  getBlockByNumber(no: number): Promise<Block | null>
  getBlocksMined(address: string, limit: number, page: number): Promise<Block[]>

  // Uncles
  getUncle(hash: string): Promise<Uncle | null>
  getUncles(limit: number, page: number): Promise<Uncle[]>

  // Txs
  getTx(hash: string): Promise<Tx | null>
  getTxs(limit: number, page: number): Promise<Tx[]>
  getBlockTxs(hash: string): Promise<Tx[]>
  getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]>
  getAddressTotalTxs(hash: string): Promise<number>

  // Pending Txs
  getPendingTxs(limit: number, page: number): Promise<PendingTx[]>
  getPendingTxsOfAddress(hash: string, limit: number, page: number): Promise<PendingTx[]>

  // Exchanges
  // TODO

  // Statistics
  getAverageTotalDifficulty(duration: string): Promise<Statistic[]>
  getAverageGasPrice(duration: string): Promise<Statistic[]>
  getAverageTxFee(duration: string): Promise<Statistic[]>
  getAverageSuccessfullTx(duration: string): Promise<Statistic[]>
  getAverageFailedTx(duration: string): Promise<Statistic[]>

  // Search
  search(hash: string): Promise<any>
}
