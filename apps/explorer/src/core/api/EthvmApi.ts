import { CoinExchangeRate, Contract, PendingTx, TokenExchangeRate, TokenHolder, Transfer } from '@app/core/models'

export interface EthvmApi {

  // Contracts
  getContract(address: string): Promise<Contract | null>

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

  // Search
  search(hash: string): Promise<any>
}
