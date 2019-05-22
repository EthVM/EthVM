import { CoinExchangeRate, Contract, PendingTx, TokenExchangeRate, TokenHolder, Transfer } from '@app/core/models'

export interface EthvmApi {
  // Contracts
  getContract(address: string): Promise<Contract | null>

  // Exchanges
  getExchangeRateQuote(pair: string): Promise<CoinExchangeRate>
  getTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRate | null>

  // Pending Txs
  getPendingTxs(limit: number, page: number): Promise<PendingTx[]>
  getPendingTxsOfAddress(address: string, filter: string, limit: number, page: number): Promise<PendingTx[]>
  getNumberOfPendingTxsOfAddress(address: string): Promise<number>
  getTotalNumberOfPendingTxs(): Promise<number>

  // Search
  search(hash: string): Promise<any>
}
