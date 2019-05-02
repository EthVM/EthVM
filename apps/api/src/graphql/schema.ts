
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
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

export class Account {
    address?: string;
    balance?: BigNumber;
    totalTxCount?: BigNumber;
    inTxCount?: BigNumber;
    outTxCount?: BigNumber;
    isMiner?: boolean;
    isContractCreator?: boolean;
}

export class AddressBalance {
    address?: string;
    balance?: BigNumber;
}

export class AggregateBlockMetric {
    timestamp?: Date;
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

export class AggregateBlockMetricPage {
    items?: AggregateBlockMetric[];
    offset?: number;
    limit?: number;
    totalCount?: number;
}

export class Block {
    header?: BlockHeader;
    transactions?: Transaction[];
    uncles?: Uncle[];
    rewards?: Reward[];
}

export class BlockHeader {
    number?: BigNumber;
    hash?: string;
    parentHash?: string;
    nonce?: BigNumber;
    sha3Uncles?: string;
    logsBloom?: string;
    transactionsRoot?: string;
    stateRoot?: string;
    receiptsRoot?: string;
    author?: string;
    difficulty?: BigNumber;
    totalDifficulty?: BigNumber;
    extraData?: string;
    gasLimit?: BigNumber;
    gasUsed?: BigNumber;
    timestamp?: string;
    size?: string;
    blockTime?: string;
    uncleHashes?: string[];
    transactionHashes?: string[];
}

export class BlockMetric {
    number: BigNumber;
    blockHash?: string;
    timestamp?: Date;
    blockTime?: number;
    numUncles?: number;
    difficulty?: BigNumber;
    totalDifficulty?: BigNumber;
    totalGasPrice?: BigNumber;
    avgGasLimit?: BigNumber;
    avgGasPrice?: BigNumber;
    totalTxs?: number;
    numSuccessfulTxs?: number;
    numFailedTxs?: number;
    numInternalTxs?: number;
    totalTxFees?: BigNumber;
    avgTxFees?: BigNumber;
}

export class BlockMetricPage {
    items?: BlockMetric[];
    offset?: number;
    limit?: number;
    totalCount?: number;
}

export class BlocksPage {
    items?: Block[];
    totalCount?: number;
}

export class BlockSummary {
    number?: BigNumber;
    hash?: string;
    author?: string;
    numTxs?: BigNumber;
    numSuccessfulTxs?: BigNumber;
    numFailedTxs?: BigNumber;
    reward?: BigNumber;
    uncleHashes?: string[];
    transactionHashes?: string[];
    difficulty?: BigNumber;
    timestamp?: string;
}

export class BlockSummaryPage {
    items?: BlockSummary[];
    totalCount?: BigNumber;
}

export class CoinExchangeRate {
    currency?: string;
    price?: Decimal;
    marketCap?: Decimal;
    vol24h?: Decimal;
    change24h?: Decimal;
    lastUpdated?: Decimal;
}

export class Contract {
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
}

export class ContractLogo {
    src?: string;
}

export class ContractMetadata {
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

export class ContractSocial {
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

export class ContractsPage {
    items?: Contract[];
    totalCount?: number;
}

export class ContractSupport {
    email?: string;
    url?: string;
}

export abstract class IQuery {
    abstract accountByAddress(address: string): Account | Promise<Account>;

    abstract blockMetrics(offset?: number, limit?: number): BlockMetricPage | Promise<BlockMetricPage>;

    abstract aggregateBlockMetrics(start: Date, end: Date, bucket: TimeBucket, offset?: number, limit?: number): AggregateBlockMetricPage | Promise<AggregateBlockMetricPage>;

    abstract hashRate(): BigNumber | Promise<BigNumber>;

    abstract blockSummaries(offset?: number, limit?: number): BlockSummaryPage | Promise<BlockSummaryPage>;

    abstract blocks(limit?: number, page?: number, fromBlock?: Long): Block[] | Promise<Block[]>;

    abstract blockByHash(hash?: string): Block | Promise<Block>;

    abstract blockByNumber(number?: number): Block | Promise<Block>;

    abstract minedBlocksByAddress(address?: string, limit?: number, page?: number): BlocksPage | Promise<BlocksPage>;

    abstract totalNumberOfBlocks(): BigNumber | Promise<BigNumber>;

    abstract contractByAddress(address: string): Contract | Promise<Contract>;

    abstract contractsCreatedBy(creator: string, limit?: number, page?: number): ContractsPage | Promise<ContractsPage>;

    abstract search(query: string): Search | Promise<Search>;

    abstract tokenHolders(address: string, limit?: number, page?: number): TokenHoldersPage | Promise<TokenHoldersPage>;

    abstract tokenHolder(address: string, holderAddress: string): TokenHolder | Promise<TokenHolder>;

    abstract addressAllTokensOwned(address: string): Token[] | Promise<Token[]>;

    abstract addressAmountTokensOwned(address: string): number | Promise<number>;

    abstract coinExchangeRate(pair: ExchangeRatePair): CoinExchangeRate | Promise<CoinExchangeRate>;

    abstract tokenExchangeRates(filter: TokenExchangeRateFilter, limit?: number, page?: number): TokenExchangeRate[] | Promise<TokenExchangeRate[]>;

    abstract totalNumTokenExchangeRates(): number | Promise<number>;

    abstract tokenExchangeRateBySymbol(symbol: string): TokenExchangeRate | Promise<TokenExchangeRate>;

    abstract tokenExchangeRateByAddress(address: string): TokenExchangeRate | Promise<TokenExchangeRate>;

    abstract tokensMetadata(symbols?: string[]): TokenMetadata[] | Promise<TokenMetadata[]>;

    abstract tokenTransfersByContractAddress(contractAddress: string, limit?: number, page?: number): TransfersPage | Promise<TransfersPage>;

    abstract tokenTransfersByContractAddressForHolder(contractAddress: string, holderAddress: string, filter?: FilterEnum, limit?: number, page?: number): TransfersPage | Promise<TransfersPage>;

    abstract internalTransactionsByAddress(address: string, limit?: number, page?: number): TransfersPage | Promise<TransfersPage>;

    abstract transactionSummaries(offset?: number, limit?: number): TransactionSummaryPage | Promise<TransactionSummaryPage>;

    abstract tx(hash: string): Transaction | Promise<Transaction>;

    abstract txs(limit?: number, page?: number, fromBlock?: BigNumber): Transaction[] | Promise<Transaction[]>;

    abstract txsForAddress(hash: string, filter: FilterEnum, limit?: number, page?: number): Transaction[] | Promise<Transaction[]>;

    abstract totalNumberOfTransactions(): BigNumber | Promise<BigNumber>;

    abstract uncleByHash(hash: string): Uncle | Promise<Uncle>;

    abstract uncles(limit?: number, page?: number, fromUncle?: number): Uncle[] | Promise<Uncle[]>;

    abstract totalNumberOfUncles(): BigNumber | Promise<BigNumber>;

    abstract latestUncleBlockNumber(): BigNumber | Promise<BigNumber>;

    abstract temp__(): boolean | Promise<boolean>;
}

export class Receipt {
    transactionHash?: string;
    transactionIndex?: string;
    blockHash?: string;
    blockNumber?: BigNumber;
    from?: string;
    to?: string;
    contractAddress?: string;
    cumulativeGasUsed?: BigNumber;
    gasUsed?: BigNumber;
    logs?: string;
    logsBloom?: string;
    root?: string;
    status?: string;
}

export class Reward {
    address?: string;
    blockHash?: string;
    deltaType?: DeltaType;
    amount?: BigNumber;
}

export class Search {
    type?: SearchType;
    address?: AddressBalance;
    block?: Block;
    uncle?: Uncle;
    tx?: Transaction;
}

export abstract class ISubscription {
    abstract newBlockMetric(): BlockMetric | Promise<BlockMetric>;

    abstract newBlock(): BlockSummary | Promise<BlockSummary>;

    abstract hashRate(): BigNumber | Promise<BigNumber>;

    abstract isSyncing(): boolean | Promise<boolean>;

    abstract newTransaction(): TransactionSummary | Promise<TransactionSummary>;
}

export class Token {
    name?: string;
    website?: string;
    email?: string;
    symbol?: string;
    address?: string;
    decimals?: number;
    balance?: BigNumber;
    currentPrice?: BigNumber;
}

export class TokenExchangeRate {
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
    owner?: string;
    holdersCount?: number;
}

export class TokenHolder {
    address?: string;
    balance?: BigNumber;
}

export class TokenHoldersPage {
    items?: TokenHolder[];
    totalCount?: number;
}

export class TokenMetadata {
    name?: string;
    website?: string;
    email?: string;
    symbol?: string;
    address?: string;
    decimals?: number;
    logo?: string;
}

export class Trace {
    blockHash?: string;
    transactionHash?: string;
    traceAddress?: string;
    transactionPosition?: number;
    blockNumber?: BigNumber;
    subtraces?: number;
    error?: string;
    type?: string;
    action?: string;
    result?: string;
}

export class Transaction {
    hash?: string;
    nonce?: BigNumber;
    blockHash?: string;
    blockNumber?: BigNumber;
    transactionIndex?: number;
    from?: string;
    to?: string;
    value?: BigNumber;
    gas?: BigNumber;
    gasPrice?: BigNumber;
    input?: Buffer;
    v?: string;
    r?: string;
    s?: string;
    timestamp?: string;
    creates?: string;
    chainId?: string;
    receipt?: Receipt;
    traces?: Trace[];
    successful?: boolean;
}

export class TransactionSummary {
    hash?: string;
    blockNumber?: BigNumber;
    transactionIndex?: number;
    from?: string;
    to?: string;
    creates?: string;
    contractName?: string;
    contractSymbol?: string;
    value?: BigNumber;
    fee?: BigNumber;
    successful?: boolean;
    timestamp?: string;
}

export class TransactionSummaryPage {
    items?: TransactionSummary[];
    totalCount?: BigNumber;
}

export class Transfer {
    id?: string;
    to?: string;
    deltaType?: DeltaType;
    from?: string;
    contractAddress?: string;
    tokenType?: string;
    amount?: BigNumber;
    traceLocationBlockHash?: string;
    traceLocationBlockNumber?: BigNumber;
    traceLocationTransactionHash?: string;
    traceLocationTransactionIndex?: number;
    traceLocationLogIndex?: number;
    traceLocationTraceAddress?: string;
    timestamp?: string;
}

export class TransfersPage {
    items?: Transfer[];
    totalCount?: BigNumber;
}

export class Uncle {
    hash?: string;
    index?: number;
    nephewNumber?: BigNumber;
    nephewHash?: string;
    number?: BigNumber;
    height?: string;
    parentHash?: string;
    nonce?: BigNumber;
    sha3Uncles?: string;
    logsBloom?: string;
    transactionsRoot?: string;
    stateRoot?: string;
    receiptsRoot?: string;
    author?: string;
    difficulty?: BigNumber;
    totalDifficulty?: BigNumber;
    extraData?: string;
    gasLimit?: BigNumber;
    gasUsed?: BigNumber;
    timestamp?: string;
    size?: string;
    rewardAmount?: BigNumber;
}

export type BigNumber = any;
export type Buffer = any;
export type Date = any;
export type Decimal = any;
export type JSON = any;
export type Long = any;
export type StatisticValue = any;
