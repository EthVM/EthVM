
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
    INTERNAL_TX = "INTERNAL_TX",
    TX_FEE = "TX_FEE"
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
    hasInternalTransfers: boolean;
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
    address: string;
    contractAddress?: string;
    balance?: BigNumber;
    tokenId?: BigNumber;
    timestamp: Date;
    blockNumber: BigNumber;
}

export interface BalancePage {
    hasMore: boolean;
    items: Balance[];
}

export interface Block {
    header: BlockHeader;
    uncleHashes: string[];
    transactionHashes: string[];
    rewards: Reward[];
    totalTxFees: BigNumber;
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
    timestamp: Date;
    size: number;
    blockTime?: number;
}

export interface BlockMetric {
    number: BigNumber;
    hash: string;
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

export interface BlockMetricsPage {
    items: BlockMetric[];
    offset: number;
    limit: number;
    totalCount: number;
}

export interface BlockMetricsTrace {
    number: BigNumber;
    hash: string;
    timestamp: Date;
    totalGasPrice: BigNumber;
    avgGasLimit: BigNumber;
    avgGasPrice: BigNumber;
    totalTxFees: BigNumber;
    avgTxFees: BigNumber;
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
    timestamp: Date;
}

export interface BlockSummaryByAuthorPage {
    items: BlockSummary[];
    totalCount: BigNumber;
}

export interface BlockSummaryPage {
    items: BlockSummary[];
    totalCount: BigNumber;
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
    createdAtBlockHash?: string;
    createdAtBlockNumber?: BigNumber;
    createdAtTransactionHash?: string;
    createdAtTraceAddress?: string;
    createdAtTimestamp?: Date;
    destroyedAtBlockHash?: string;
    destroyedAtBlockNumber?: BigNumber;
    destroyedAtTransactionHash?: string;
    destroyedAtTraceAddress?: string;
    destroyedAtTimestamp?: Date;
    ethListContractMetadata?: ContractMetadata;
    totalSupply?: BigNumber;
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
    timestamp: Date;
}

export interface ContractSummaryPage {
    items: ContractSummary[];
    hasMore: boolean;
}

export interface ContractSupport {
    email?: string;
    url?: string;
}

export interface Metadata {
    isSyncing: boolean;
}

export interface IMutation {
    foo(): boolean | Promise<boolean>;
}

export interface IQuery {
    accountByAddress(address: string, blockNumber?: BigNumber): Account | Promise<Account>;
    balances(addresses: string[], contracts?: string[], offset?: number, limit?: number, blockNumber?: BigNumber): BalancePage | Promise<BalancePage>;
    blockMetrics(offset?: number, limit?: number, blockNumber?: BigNumber): BlockMetricsPage | Promise<BlockMetricsPage>;
    blockMetricsTimeseries(bucket: TimeBucket, field: BlockMetricField, start?: Date, end?: Date, blockNumber?: BigNumber): AggregateBlockMetric[] | Promise<AggregateBlockMetric[]>;
    hashRate(blockNumber?: BigNumber): BigNumber | Promise<BigNumber>;
    blockSummaries(blockNumber?: BigNumber, offset?: number, limit?: number): BlockSummaryPage | Promise<BlockSummaryPage>;
    blockSummariesByAuthor(author: string, offset?: number, limit?: number, blockNumber?: BigNumber): BlockSummaryByAuthorPage | Promise<BlockSummaryByAuthorPage>;
    blockByHash(hash: string, blockNumber?: BigNumber): Block | Promise<Block>;
    blockByNumber(number: BigNumber, blockNumber?: BigNumber): Block | Promise<Block>;
    contractByAddress(address: string, blockNumber?: BigNumber): Contract | Promise<Contract>;
    contractsCreatedBy(creator: string, offset?: number, limit?: number, blockNumber?: BigNumber): ContractSummaryPage | Promise<ContractSummaryPage>;
    metadata(): Metadata | Promise<Metadata>;
    search(query: string, blockNumber?: BigNumber): Search | Promise<Search>;
    tokenHolder(address: string, holderAddress: string, blockNumber?: BigNumber): TokenHolder | Promise<TokenHolder>;
    addressAllTokensOwned(address: string, offset?: number, limit?: number, blockNumber?: BigNumber): TokenBalancePage | Promise<TokenBalancePage>;
    addressTotalTokenValueUSD(address: string, blockNumber?: BigNumber): BigNumber | Promise<BigNumber>;
    coinExchangeRate(pair: ExchangeRatePair): CoinExchangeRate | Promise<CoinExchangeRate>;
    tokenExchangeRates(addresses?: string[], sort?: TokenExchangeRateFilter, offset?: number, limit?: number): TokenExchangeRatesPage | Promise<TokenExchangeRatesPage>;
    totalNumTokenExchangeRates(): number | Promise<number>;
    tokenExchangeRateBySymbol(symbol: string): TokenExchangeRate | Promise<TokenExchangeRate>;
    tokenExchangeRateByAddress(address: string): TokenExchangeRate | Promise<TokenExchangeRate>;
    tokensMetadata(addresses?: string[], offset?: number, limit?: number): TokenMetadataPage | Promise<TokenMetadataPage>;
    tokenHolders(address: string, offset?: number, limit?: number, blockNumber?: BigNumber): TokenHoldersPage | Promise<TokenHoldersPage>;
    tokenDetailByAddress(address: string, blockNumber?: BigNumber): TokenDetail | Promise<TokenDetail>;
    internalTransactionsByAddress(address: string, offset?: number, limit?: number, blockNumber?: BigNumber): TransferPage | Promise<TransferPage>;
    tokenTransfersByContractAddress(contractAddress: string, offset?: number, limit?: number, blockNumber?: BigNumber): TransferPage | Promise<TransferPage>;
    tokenTransfersByContractAddressForHolder(contractAddress: string, holderAddress: string, filter?: FilterEnum, offset?: number, limit?: number, blockNumber?: BigNumber): TransferPage | Promise<TransferPage>;
    totalTokenTransfersByContractAddressForHolder(contractAddress: string, holderAddress: string, blockNumber?: BigNumber): BigNumber | Promise<BigNumber>;
    balanceDeltas(addresses: string[], contracts?: string[], filter?: FilterEnum, timestampFrom?: number, timestampTo?: number, offset?: number, limit?: number, blockNumber?: BigNumber): TransferPage | Promise<TransferPage>;
    transactionSummaries(blockNumber?: BigNumber, offset?: number, limit?: number): TransactionSummaryPage | Promise<TransactionSummaryPage>;
    transactionSummariesForBlockNumber(number: BigNumber, offset?: number, limit?: number, blockNumber?: BigNumber): TransactionSummaryPage | Promise<TransactionSummaryPage>;
    transactionSummariesForBlockHash(hash: string, offset?: number, limit?: number, blockNumber?: BigNumber): TransactionSummaryPage | Promise<TransactionSummaryPage>;
    transactionSummariesForAddress(address: string, filter?: FilterEnum, offset?: number, limit?: number, blockNumber?: BigNumber): TransactionSummaryPage | Promise<TransactionSummaryPage>;
    tx(hash: string, blockNumber?: BigNumber): Transaction | Promise<Transaction>;
    uncleByHash(hash: string, blockNumber?: BigNumber): Uncle | Promise<Uncle>;
    uncles(offset?: number, limit?: number, blockNumber?: BigNumber): UnclePage | Promise<UnclePage>;
    latestUncleBlockNumber(blockNumber?: BigNumber): BigNumber | Promise<BigNumber>;
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
    newBlockMetricsTrace(): BlockMetricsTrace | Promise<BlockMetricsTrace>;
    newBlock(): BlockSummary | Promise<BlockSummary>;
    hashRate(): BigNumber | Promise<BigNumber>;
    isSyncing(): boolean | Promise<boolean>;
    keepAlive(): boolean | Promise<boolean>;
    newTransaction(): TransactionSummary | Promise<TransactionSummary>;
    newTransactions(): TransactionSummary[] | Promise<TransactionSummary[]>;
}

export interface TokenBalance {
    name?: string;
    website?: string;
    email?: string;
    symbol?: string;
    contractAddress?: string;
    holderAddress?: string;
    decimals?: number;
    balance?: BigNumber;
    currentPrice?: BigNumber;
    priceChangePercentage24h?: BigNumber;
    image?: string;
}

export interface TokenBalancePage {
    items: TokenBalance[];
    hasMore: boolean;
}

export interface TokenDetail {
    address: string;
    creator?: string;
    contractType?: string;
    name?: string;
    symbol?: string;
    decimals?: number;
    logo?: string;
    email?: string;
    social?: ContractSocial;
    website?: string;
    currentPrice?: BigNumber;
    circulatingSupply?: BigNumber;
    totalSupply?: BigNumber;
    marketCap?: BigNumber;
    priceChangePercentage24h?: BigNumber;
    totalVolume?: BigNumber;
    holdersCount?: number;
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
    hasMore: boolean;
}

export interface TokenHolder {
    address: string;
    balance: BigNumber;
}

export interface TokenHoldersPage {
    items: TokenHolder[];
    hasMore: boolean;
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

export interface TokenMetadataPage {
    items: TokenMetadata[];
    hasMore: boolean;
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
    timestamp: Date;
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
    timestamp: Date;
}

export interface TransactionSummaryPage {
    items: TransactionSummary[];
    totalCount: BigNumber;
}

export interface Transfer {
    id: string;
    to: string;
    deltaType: DeltaType;
    from?: string;
    contractAddress?: string;
    tokenType?: string;
    amount?: BigNumber;
    tokenId?: BigNumber;
    blockHash: string;
    blockNumber: BigNumber;
    transactionHash?: string;
    traceAddress?: string;
    timestamp: Date;
}

export interface TransferPage {
    items: Transfer[];
    hasMore: boolean;
}

export interface Uncle {
    hash: string;
    index: number;
    nephewHash: string;
    number: BigNumber;
    height: BigNumber;
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
    timestamp: Date;
    size: number;
    rewardAmount: BigNumber;
}

export interface UnclePage {
    items: Uncle[];
    totalCount: BigNumber;
}

export type BigNumber = any;
export type Buffer = any;
export type Decimal = any;
export type JSON = any;
export type Long = any;
export type StatisticValue = any;
