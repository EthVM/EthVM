
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum BlockMetricField {
    AVG_BLOCK_TIME = "AVG_BLOCK_TIME",
    AVG_NUM_UNCLES = "AVG_NUM_UNCLES",
    AVG_DIFFICULTY = "AVG_DIFFICULTY",
    AVG_TOTAL_DIFFICULTY = "AVG_TOTAL_DIFFICULTY",
    AVG_GAS_LIMIT = "AVG_GAS_LIMIT",
    AVG_GAS_PRICE = "AVG_GAS_PRICE",
    AVG_NUM_TXS = "AVG_NUM_TXS",
    AVG_NUM_SUCCESSFUL_TXS = "AVG_NUM_SUCCESSFUL_TXS",
    AVG_NUM_FAILED_TXS = "AVG_NUM_FAILED_TXS",
    AVG_NUM_INTERNAL_TXS = "AVG_NUM_INTERNAL_TXS",
    AVG_TX_FEES = "AVG_TX_FEES",
    AVG_TOTAL_TX_FEES = "AVG_TOTAL_TX_FEES"
}

export enum DeltaType {
    UNCLE_REWARD = "UNCLE_REWARD",
    BLOCK_REWARD = "BLOCK_REWARD",
    CONTRACT_CREATION = "CONTRACT_CREATION",
    TOKEN_TRANSFER = "TOKEN_TRANSFER",
    CONTRACT_DESTRUCTION = "CONTRACT_DESTRUCTION",
    TX = "TX",
    MINER_FEE = "MINER_FEE",
    INTERNAL_TX = "INTERNAL_TX"
}

export enum Duration {
    ALL = "ALL",
    YEAR = "YEAR",
    MONTH = "MONTH",
    WEEK = "WEEK",
    DAY = "DAY"
}

export enum ExchangeRatePair {
    ethereum_usd = "ethereum_usd"
}

export enum FilterEnum {
    in = "in",
    out = "out",
    all = "all"
}

export enum Order {
    asc = "asc",
    desc = "desc"
}

export enum SearchType {
    Address = "Address",
    Block = "Block",
    Uncle = "Uncle",
    Tx = "Tx",
    None = "None"
}

export enum TimeBucket {
    ONE_HOUR = "ONE_HOUR",
    ONE_DAY = "ONE_DAY",
    ONE_WEEK = "ONE_WEEK",
    ONE_MONTH = "ONE_MONTH",
    ONE_YEAR = "ONE_YEAR"
}

export enum TokenExchangeRateFilter {
    price_high = "price_high",
    price_low = "price_low",
    volume_high = "volume_high",
    volume_low = "volume_low",
    market_cap_high = "market_cap_high",
    market_cap_low = "market_cap_low",
    market_cap_rank = "market_cap_rank"
}

export interface Account {
    address: string;
    balance: BigNumber;
    totalTxCount: BigNumber;
    inTxCount: BigNumber;
    outTxCount: BigNumber;
    isMiner: boolean;
    isContractCreator: boolean;
    isContract: boolean;
}

export interface AddressBalance {
    address: string;
    balance: BigNumber;
}

export interface AggregateBlockMetric {
    timestamp: Date;
    avgBlockTime?: number;
    avgNumUncles?: number;
    avgDifficulty?: BigNumber;
    avgTotalDifficulty?: BigNumber;
    avgGasLimit?: BigNumber;
    avgGasPrice?: BigNumber;
    avgNumTxs?: number;
    avgNumSuccessfulTxs?: number;
    avgNumFailedTxs?: number;
    avgNumInternalTxs?: number;
    avgTxFees?: BigNumber;
    avgTotalTxFees?: BigNumber;
}

export interface Balance {
    id: string;
    address: string;
    contractAddress?: string;
    tokenType?: string;
    amount: BigNumber;
    balance: BigNumber;
    timestamp: number;
}

export interface BalancesPage {
    items: Balance[];
    totalCount: BigNumber;
}

export interface Block {
    header: BlockHeader;
    uncleHashes: string[];
    transactionHashes: string[];
    rewards: Reward[];
}

export interface BlockHeader {
    number: BigNumber;
    hash: string;
    parentHash: string;
    nonce?: BigNumber;
    sha3Uncles: string;
    logsBloom: string;
    transactionsRoot: string;
    stateRoot: string;
    receiptsRoot: string;
    author: string;
    difficulty: BigNumber;
    totalDifficulty: BigNumber;
    extraData: string;
    gasLimit: BigNumber;
    gasUsed: BigNumber;
    timestamp: number;
    size: number;
    blockTime: number;
}

export interface BlockMetric {
    number: BigNumber;
    blockHash: string;
    timestamp: Date;
    blockTime: number;
    numUncles: number;
    difficulty: BigNumber;
    totalDifficulty: BigNumber;
    totalGasPrice: BigNumber;
    avgGasLimit: BigNumber;
    avgGasPrice: BigNumber;
    totalTxs: number;
    numSuccessfulTxs: number;
    numFailedTxs: number;
    numInternalTxs: number;
    totalTxFees: BigNumber;
    avgTxFees: BigNumber;
}

export interface BlockMetricPage {
    items: BlockMetric[];
    offset: number;
    limit: number;
    totalCount: number;
}

export interface BlockSummary {
    number: BigNumber;
    hash: string;
    author: string;
    numTxs: BigNumber;
    numSuccessfulTxs: BigNumber;
    numFailedTxs: BigNumber;
    reward: BigNumber;
    uncleHashes: string[];
    transactionHashes: string[];
    difficulty: BigNumber;
    timestamp: number;
}

export interface BlockSummaryPage {
    items: BlockSummary[];
    totalCount: number;
}

export interface CoinExchangeRate {
    currency?: string;
    price?: Decimal;
    marketCap?: Decimal;
    vol24h?: Decimal;
    change24h?: Decimal;
    lastUpdated?: Decimal;
}

export interface Contract {
    address?: string;
    creator?: string;
    init?: string;
    code?: string;
    refundAddress?: string;
    refundBalance?: BigNumber;
    traceCreatedAtBlockHash?: string;
    traceCreatedAtBlockNumber?: BigNumber;
    traceCreatedAtTransactionHash?: string;
    traceCreatedAtTransactionIndex?: number;
    traceCreatedAtLogIndex?: number;
    traceCreatedAtTraceAddress?: string;
    traceDestroyedAtBlockHash?: string;
    traceDestroyedAtBlockNumber?: BigNumber;
    traceDestroyedAtTransactionHash?: string;
    traceDestroyedAtTransactionIndex?: Long;
    traceDestroyedAtLogIndex?: Long;
    traceDestroyedAtTraceAddress?: string;
    traceDestroyedAt?: Buffer;
    metadata?: ContractMetadata;
    totalSupply?: BigNumber;
    createdAtTx?: Transaction;
    createdAtTxSummary?: TransactionSummary;
}

export interface ContractLogo {
    src?: string;
}

export interface ContractMetadata {
    address?: string;
    name?: string;
    symbol?: string;
    decimals?: number;
    ensAddress?: string;
    type?: string;
    logo?: ContractLogo;
    support?: ContractSupport;
    social?: ContractSocial;
    website?: string;
}

export interface ContractSocial {
    blog?: string;
    chat?: string;
    facebook?: string;
    forum?: string;
    github?: string;
    gitter?: string;
    instagram?: string;
    linkedin?: string;
    reddit?: string;
    slack?: string;
    telegram?: string;
    twitter?: string;
    youtube?: string;
}

export interface ContractSummary {
    address: string;
    creator: string;
    blockNumber: BigNumber;
    txHash: string;
    txFee: BigNumber;
    timestamp: number;
}

export interface ContractSummaryPage {
    items: ContractSummary[];
    totalCount: number;
}

export interface ContractSupport {
    email?: string;
    url?: string;
}

export interface IQuery {
    blockMetrics(offset?: number, limit?: number): BlockMetricPage | Promise<BlockMetricPage>;
    blockMetricsTimeseries(start: Date, end: Date, bucket: TimeBucket, fields: BlockMetricField[]): AggregateBlockMetric[] | Promise<AggregateBlockMetric[]>;
    accountByAddress(address: string): Account | Promise<Account>;
    hashRate(): BigNumber | Promise<BigNumber>;
    blockSummaries(fromBlock?: BigNumber, offset?: number, limit?: number): BlockSummaryPage | Promise<BlockSummaryPage>;
    blockSummariesByAuthor(author: string, offset?: number, limit?: number): BlockSummaryPage | Promise<BlockSummaryPage>;
    blockByHash(hash: string): Block | Promise<Block>;
    blockByNumber(number: BigNumber): Block | Promise<Block>;
    contractByAddress(address: string): Contract | Promise<Contract>;
    contractsCreatedBy(creator: string, offset?: number, limit?: number): ContractSummaryPage | Promise<ContractSummaryPage>;
    search(query: string): Search | Promise<Search>;
    tokenHolder(address: string, holderAddress: string): TokenHolder | Promise<TokenHolder>;
    addressAllTokensOwned(address: string, offset?: number, limit?: number): TokenPage | Promise<TokenPage>;
    addressTotalTokenValueUSD(address: string): BigNumber | Promise<BigNumber>;
    coinExchangeRate(pair: ExchangeRatePair): CoinExchangeRate | Promise<CoinExchangeRate>;
    tokenExchangeRates(filter: TokenExchangeRateFilter, symbols: string[], limit?: number, page?: number): TokenExchangeRate[] | Promise<TokenExchangeRate[]>;
    totalNumTokenExchangeRates(): number | Promise<number>;
    tokenExchangeRateBySymbol(symbol: string): TokenExchangeRate | Promise<TokenExchangeRate>;
    tokenExchangeRateByAddress(address: string): TokenExchangeRate | Promise<TokenExchangeRate>;
    tokensMetadata(symbols?: string[]): TokenMetadata[] | Promise<TokenMetadata[]>;
    tokenExchangeRatePage(sort: TokenExchangeRateFilter, symbols: string[], offset?: number, limit?: number): TokenExchangeRatesPage | Promise<TokenExchangeRatesPage>;
    tokenHolders(address: string, offset?: number, limit?: number): TokenHoldersPage | Promise<TokenHoldersPage>;
    tokenTransfersByContractAddressesForHolder(contractAddresses: string[], holderAddress: string, filter?: FilterEnum, limit?: number, page?: number, timestampFrom?: number, timestampTo?: number): TransferPage | Promise<TransferPage>;
    internalTransactionsByAddress(address: string, offset?: number, limit?: number): TransferPage | Promise<TransferPage>;
    tokenBalancesByContractAddressForHolder(contractAddress: string, holderAddress: string, timestampFrom?: number, timestampTo?: number): BalancesPage | Promise<BalancesPage>;
    tokenTransfersByContractAddress(contractAddress: string, offset?: number, limit?: number): TransferPage | Promise<TransferPage>;
    tokenTransfersByContractAddressForHolder(contractAddress: string, holderAddress: string, filter?: FilterEnum, offset?: number, limit?: number): TransferPage | Promise<TransferPage>;
    transactionSummaries(fromBlock?: BigNumber, offset?: number, limit?: number): TransactionSummaryPage | Promise<TransactionSummaryPage>;
    transactionSummariesForBlockNumber(number: BigNumber, offset?: number, limit?: number): TransactionSummaryPage | Promise<TransactionSummaryPage>;
    transactionSummariesForBlockHash(hash: string, offset?: number, limit?: number): TransactionSummaryPage | Promise<TransactionSummaryPage>;
    transactionSummariesForAddress(address: string, filter?: FilterEnum, offset?: number, limit?: number): TransactionSummaryPage | Promise<TransactionSummaryPage>;
    tx(hash: string): Transaction | Promise<Transaction>;
    uncleByHash(hash: string): Uncle | Promise<Uncle>;
    uncles(offset?: number, limit?: number, fromUncle?: BigNumber): UnclePage | Promise<UnclePage>;
    latestUncleBlockNumber(): BigNumber | Promise<BigNumber>;
    temp__(): boolean | Promise<boolean>;
}

export interface Receipt {
    transactionHash: string;
    transactionIndex: string;
    blockHash: string;
    blockNumber: BigNumber;
    from: string;
    to?: string;
    contractAddress?: string;
    cumulativeGasUsed: BigNumber;
    gasUsed: BigNumber;
    logs: string;
    logsBloom: string;
    root: string;
    status?: string;
}

export interface Reward {
    address: string;
    blockHash: string;
    deltaType: DeltaType;
    amount: BigNumber;
}

export interface Search {
    type: SearchType;
    address?: AddressBalance;
    block?: Block;
    uncle?: Uncle;
    tx?: Transaction;
}

export interface ISubscription {
    newBlockMetric(): BlockMetric | Promise<BlockMetric>;
    newBlock(): BlockSummary | Promise<BlockSummary>;
    hashRate(): BigNumber | Promise<BigNumber>;
    isSyncing(): boolean | Promise<boolean>;
    newTransaction(): TransactionSummary | Promise<TransactionSummary>;
}

export interface Token {
    name?: string;
    website?: string;
    email?: string;
    symbol?: string;
    address?: string;
    decimals?: number;
    balance?: BigNumber;
    currentPrice?: BigNumber;
}

export interface TokenExchangeRate {
    address?: string;
    symbol?: string;
    name?: string;
    image?: string;
    currentPrice?: BigNumber;
    marketCap?: BigNumber;
    marketCapRank?: number;
    totalVolume?: BigNumber;
    high24h?: BigNumber;
    low24h?: BigNumber;
    priceChange24h?: BigNumber;
    priceChangePercentage24h?: BigNumber;
    marketCapChange24h?: BigNumber;
    marketCapChangePercentage24h?: BigNumber;
    circulatingSupply?: BigNumber;
    totalSupply?: BigNumber;
    lastUpdated?: string;
    holdersCount?: number;
    contract?: Contract;
}

export interface TokenExchangeRatesPage {
    items: TokenExchangeRate[];
    totalCount: number;
}

export interface TokenHolder {
    address: string;
    balance: BigNumber;
}

export interface TokenHoldersPage {
    items: TokenHolder[];
    totalCount: number;
}

export interface TokenMetadata {
    name?: string;
    website?: string;
    email?: string;
    symbol?: string;
    address?: string;
    decimals?: number;
    logo?: string;
}

export interface TokenPage {
    items: Token[];
    totalCount: number;
}

export interface Trace {
    blockHash: string;
    transactionHash?: string;
    rootError?: string;
    traces: string;
}

export interface Transaction {
    hash: string;
    nonce: BigNumber;
    blockHash: string;
    blockNumber: BigNumber;
    transactionIndex: number;
    from: string;
    to?: string;
    value: BigNumber;
    gas: BigNumber;
    gasPrice: BigNumber;
    input: Buffer;
    v: string;
    r: string;
    s: string;
    timestamp: number;
    creates?: string;
    chainId?: string;
    receipt?: Receipt;
    trace: Trace;
    successful: boolean;
}

export interface TransactionSummary {
    hash: string;
    blockNumber: BigNumber;
    transactionIndex: number;
    from: string;
    to?: string;
    creates?: string;
    contractName?: string;
    contractSymbol?: string;
    value: BigNumber;
    fee: BigNumber;
    successful: boolean;
    timestamp: number;
}

export interface TransactionSummaryPage {
    items: TransactionSummary[];
    totalCount: number;
}

export interface Transfer {
    id: string;
    to: string;
    deltaType: DeltaType;
    from?: string;
    contractAddress?: string;
    tokenType?: string;
    amount: BigNumber;
    traceLocationBlockHash: string;
    traceLocationBlockNumber: BigNumber;
    traceLocationTransactionHash?: string;
    traceLocationTransactionIndex?: number;
    traceLocationLogIndex?: number;
    traceLocationTraceAddress?: string;
    timestamp: number;
}

export interface TransferPage {
    items: Transfer[];
    totalCount: BigNumber;
}

export interface Uncle {
    hash: string;
    index: number;
    nephewNumber: BigNumber;
    nephewHash: string;
    number: BigNumber;
    height: string;
    parentHash: string;
    nonce?: BigNumber;
    sha3Uncles: string;
    logsBloom: string;
    transactionsRoot: string;
    stateRoot: string;
    receiptsRoot: string;
    author: string;
    difficulty: BigNumber;
    totalDifficulty: BigNumber;
    extraData: string;
    gasLimit: BigNumber;
    gasUsed: BigNumber;
    timestamp: number;
    size: number;
    rewardAmount: BigNumber;
}

export interface UnclePage {
    items: Uncle[];
    totalCount: number;
}

export type BigNumber = any;
export type Buffer = any;
export type Date = any;
export type Decimal = any;
export type JSON = any;
export type Long = any;
export type StatisticValue = any;
