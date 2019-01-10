import { Account, Block, Uncle, Tx, PendingTx, Statistic } from 'ethvm-common'

export interface EthvmApi {
  // Blocks
  getBlocks(limit: number, page: number): Promise<Block[]>
  getBlock(hash: string): Promise<Block | null>
  getBlockByNumber(no: number): Promise<Block | null>
  getBlocksMined(address: string, limit: number, page: number): Promise<Block[]>

  // Uncles
  getUncles(limit: number, page: number): Promise<Uncle[]>
  getUncle(hash: string): Promise<Uncle | null>

  // Txs
  getTx(hash: string): Promise<Tx | null>
  getTxs(limit: number, page: number): Promise<Tx[]>
  getBlockTxs(hash: string): Promise<Tx[]>
  getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]>

  // Pending Txs
  getPendingTxs(limit: number, page: number): Promise<PendingTx[]>
  getPendingTxsOfAddress(hash: string, limit: number, page: number): Promise<PendingTx[]>

  // Exchanges
  // TODO

  // Statistics
  getAverageTotalDifficulty(start: Date, end: Date): Promise<Statistic[]>
  getAverageGasPrice(start: Date, end: Date): Promise<Statistic[]>
  getAverageTxFee(start: Date, end: Date): Promise<Statistic[]>
  getAverageSuccessfullTx(start: Date, end: Date): Promise<Statistic[]>
  getAverageFailedTx(start: Date, end: Date): Promise<Statistic[]>

  // Accounts
  getAccount(hash: string): Promise<Account | null>
  getAccountTxs(hash: string, limit: number, page: number): Promise<Tx[]>
  getAccountTotalTxs(hash: string): Promise<number>

  // Search
  search(hash: string): Promise<any>
}
