import { Block, CoinExchangeRate, Contract, PendingTx, SimpleBlock, SimpleTx, TokenExchangeRate, TokenHolder, Transfer, Tx, Uncle } from '@app/core/models'
import BigNumber from 'bignumber.js'

export interface EthvmApi {
  // Blocks
  getBlock(hash: string): Promise<Block | null>
  getBlocks(limit: number, page: number, fromBlock: number): Promise<SimpleBlock[]>
  getBlockByNumber(no: BigNumber): Promise<Block | null>
  getBlocksMinedOfAddress(address: string, limit: number, page: number): Promise<{ items: SimpleBlock[]; totalCount: number }>
  getTotalNumberOfBlocks(): Promise<number>

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

  // Txs
  getTxs(limit: number, order: string, fromBlock: number): Promise<SimpleTx[]>
  getTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<SimpleTx[]>
  getTotalNumberOfTxs(): Promise<number>

  // Search
  search(hash: string): Promise<any>
}
