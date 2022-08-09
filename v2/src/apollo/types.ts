export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
}

export type AddressEvent = {
    __typename?: 'AddressEvent'
    blockNumber: Scalars['Int']
    event: AddressEventType
    owner: Scalars['String']
    timestamp: Scalars['Int']
}

export enum AddressEventType {
    NewErc20Transfer = 'NEW_ERC20_TRANSFER',
    NewErc721Transfer = 'NEW_ERC721_TRANSFER',
    NewEthTransfer = 'NEW_ETH_TRANSFER',
    NewMinedBlock = 'NEW_MINED_BLOCK',
    NewMinedUncle = 'NEW_MINED_UNCLE'
}

export type AddressNfTcontracts = {
    __typename?: 'AddressNFTcontracts'
    address: Scalars['String']
    tokenContracts?: Maybe<Array<Maybe<NftContract>>>
}

export type AllTransfer = {
    __typename?: 'AllTransfer'
    contract?: Maybe<Scalars['String']>
    stateDiff?: Maybe<StateDiffChange>
    tokenInfo?: Maybe<EthTokenInfo>
    transfer: Transfer
    value: Scalars['String']
}

export type AllTransfers = {
    __typename?: 'AllTransfers'
    nextKey?: Maybe<Scalars['String']>
    transfers: Array<Maybe<AllTransfer>>
}

export type BalanceDiff = {
    __typename?: 'BalanceDiff'
    after: Scalars['String']
    before: Scalars['String']
}

export type Block = {
    __typename?: 'Block'
    difficulty: Scalars['String']
    extraData: Scalars['String']
    gasLimit: Scalars['Int']
    gasUsed: Scalars['Int']
    hash: Scalars['String']
    logsBloom: Scalars['String']
    nonce: Scalars['String']
    parentHash: Scalars['String']
    receiptsRoot: Scalars['String']
    sha3Uncles: Scalars['String']
    size: Scalars['Int']
    stateRoot: Scalars['String']
    summary: BlockSummary
    totalDifficulty: Scalars['String']
    transactions: Array<Maybe<Scalars['String']>>
    transactionsRoot: Scalars['String']
}

export type BlockRewards = {
    __typename?: 'BlockRewards'
    base: Scalars['String']
    total: Scalars['String']
    txFees: Scalars['String']
    uncles: Scalars['String']
}

export type BlockSummary = {
    __typename?: 'BlockSummary'
    miner: Scalars['String']
    number: Scalars['Int']
    rewards: BlockRewards
    timestamp: Scalars['Int']
    txCount: Scalars['Int']
    txFail: Scalars['Int']
    uncles: Array<Maybe<Scalars['String']>>
}

export type ContractMeta = {
    __typename?: 'ContractMeta'
    block: Scalars['Int']
    codeHash: Scalars['String']
    creator: Scalars['String']
    transactionHash: Scalars['String']
}

export type ContractVerify = {
    __typename?: 'ContractVerify'
    error?: Maybe<Scalars['String']>
    status: Scalars['Int']
    url?: Maybe<Scalars['String']>
}

export type Erc20TokenBalance = {
    __typename?: 'ERC20TokenBalance'
    balance: Scalars['String']
    owner: Scalars['String']
    tokenInfo: EthTokenInfo
}

export type Erc20TokenOwners = {
    __typename?: 'ERC20TokenOwners'
    nextKey?: Maybe<Scalars['String']>
    owners: Array<Maybe<Erc20TokenBalance>>
}

export type Erc20Transfer = {
    __typename?: 'ERC20Transfer'
    contract: Scalars['String']
    stateDiff?: Maybe<StateDiffChange>
    tokenInfo: EthTokenInfo
    transfer: Transfer
    value: Scalars['String']
}

export type Erc20Transfers = {
    __typename?: 'ERC20Transfers'
    nextKey?: Maybe<Scalars['String']>
    transfers: Array<Maybe<Erc20Transfer>>
}

export type Erc721TokenBalance = {
    __typename?: 'ERC721TokenBalance'
    balance: Scalars['String']
    owner: Scalars['String']
    tokenInfo: EthTokenInfo
}

export type Erc721TokenContract = {
    __typename?: 'ERC721TokenContract'
    nextKey?: Maybe<Scalars['String']>
    tokens: Array<Maybe<Erc721TokenOwner>>
}

export type Erc721TokenOwner = {
    __typename?: 'ERC721TokenOwner'
    owner: Scalars['String']
    token: Scalars['String']
    tokenInfo: EthTokenInfo
}

export type Erc721TokenOwners = {
    __typename?: 'ERC721TokenOwners'
    nextKey?: Maybe<Scalars['String']>
    owners: Array<Maybe<Erc721TokenOwner>>
}

export type Erc721Transfer = {
    __typename?: 'ERC721Transfer'
    contract: Scalars['String']
    token: Scalars['String']
    tokenInfo: EthTokenInfo
    transfer: Transfer
}

export type Erc721Transfers = {
    __typename?: 'ERC721Transfers'
    nextKey?: Maybe<Scalars['String']>
    transfers: Array<Maybe<Erc721Transfer>>
}

export type EthTransfers = {
    __typename?: 'ETHTransfers'
    nextKey?: Maybe<Scalars['String']>
    transfers: Array<Maybe<EthTransfer>>
}

export type EthOwner = {
    __typename?: 'EthOwner'
    balance: Scalars['String']
    owner: Scalars['String']
}

export type EthOwners = {
    __typename?: 'EthOwners'
    nextKey?: Maybe<Scalars['String']>
    owners?: Maybe<Array<Maybe<EthOwner>>>
}

export type EthTokenInfo = {
    __typename?: 'EthTokenInfo'
    contract: Scalars['String']
    decimals?: Maybe<Scalars['Int']>
    name?: Maybe<Scalars['String']>
    symbol?: Maybe<Scalars['String']>
    totalSupply?: Maybe<Scalars['String']>
}

export type EthTransfer = {
    __typename?: 'EthTransfer'
    stateDiff?: Maybe<StateDiffChange>
    transfer: Transfer
    value: Scalars['String']
}

export enum HashType {
    AddressHash = 'ADDRESS_HASH',
    BlockHash = 'BLOCK_HASH',
    CodeHash = 'CODE_HASH',
    TokenHash = 'TOKEN_HASH',
    TxHash = 'TX_HASH',
    UncleHash = 'UNCLE_HASH'
}

export type LatestBlockData = {
    __typename?: 'LatestBlockData'
    avgBlockTime: Scalars['Int']
    avgGasBurnt?: Maybe<Scalars['String']>
    avgGasPrice: Scalars['String']
    difficulty: Scalars['String']
    hashRate: Scalars['String']
    number: Scalars['Int']
    timestamp: Scalars['Int']
}

export type Log = {
    __typename?: 'Log'
    address: Scalars['String']
    data: Scalars['String']
    id?: Maybe<Scalars['String']>
    logIndex: Scalars['Int']
    removed: Scalars['Boolean']
    topics: Array<Scalars['String']>
    type?: Maybe<Scalars['String']>
}

export type Mutation = {
    __typename?: 'Mutation'
    /**
     * ------------------------------------------------
     * Contracts:
     * ------------------------------------------------
     */
    verifyContract: ContractVerify
}

export type MutationVerifyContractArgs = {
    contractData: Scalars['String']
}

export type NftContract = {
    __typename?: 'NFTContract'
    contractIdAddress: Scalars['String']
    contractImage?: Maybe<Scalars['String']>
    description?: Maybe<Scalars['String']>
    name?: Maybe<Scalars['String']>
    owned_asset_count: Scalars['Int']
    primary_asset_contracts?: Maybe<Array<PrimaryAssetContract>>
}

export type PendingTransfer = {
    __typename?: 'PendingTransfer'
    from: Scalars['String']
    timestamp: Scalars['Int']
    to?: Maybe<Scalars['String']>
    transactionHash: Scalars['String']
    txFee: Scalars['String']
    value: Scalars['String']
}

export type PrimaryAssetContract = {
    __typename?: 'PrimaryAssetContract'
    address: Scalars['String']
    description?: Maybe<Scalars['String']>
    external_link?: Maybe<Scalars['String']>
    image_url?: Maybe<Scalars['String']>
    name?: Maybe<Scalars['String']>
    symbol?: Maybe<Scalars['String']>
    total_supply?: Maybe<Scalars['Int']>
}

export type Query = {
    __typename?: 'Query'
    getAllEthTransfers: EthTransfers
    getAllTransfers: AllTransfers
    getBlockByHash: Block
    getBlockByNumber: Block
    /**
     * ------------------------------------------------
     * Transfers:
     * ------------------------------------------------
     */
    getBlockRewards: EthTransfers
    getBlockTransfers: EthTransfers
    getBlocksArrayByNumber: Array<Maybe<BlockSummary>>
    /**
     * ------------------------------------------------
     * Contracts:
     * ------------------------------------------------
     */
    getContractMeta: ContractMeta
    getERC20TokenBalance: Erc20TokenBalance
    /** Returns a list of all addresses that own an ERC20Token */
    getERC20TokenOwners: Erc20TokenOwners
    getERC20TokenTransfers: Erc20Transfers
    getERC20Transfers: Erc20Transfers
    /**
     * ------------------------------------------------
     * ERC721
     * ------------------------------------------------
     */
    getERC721TokenBalance: Erc721TokenBalance
    /** Returns a list of all addresses that own an ERC721Token */
    getERC721TokenOwners: Erc721TokenOwners
    getERC721TokenTransfers: Erc721Transfers
    getERC721Transfers: Erc721Transfers
    /**
     * ------------------------------------------------
     * ETH:
     * ------------------------------------------------
     */
    getEthBalance: EthOwner
    getEthOwners: EthOwners
    getEthSigs: Array<Maybe<Scalars['String']>>
    getEthTransfers: EthTransfers
    getEthTransfersV2: EthTransfers
    getGenesisRewards: EthTransfers
    /**
     * ------------------------------------------------
     * Helpers:
     * ------------------------------------------------
     */
    getHashType: HashType
    getLatestBlockInfo: LatestBlockData
    getLatestPrices: Array<Maybe<TokenMarketInfo>>
    getNFTcontractsMeta: AddressNfTcontracts
    /** Returns a list of all ERC20Tokens owned by an address */
    getOwnersERC20Tokens: Erc20TokenOwners
    /** Returns a list of ERC721 balances */
    getOwnersERC721Balances: Array<Maybe<Erc721TokenBalance>>
    /** Returns a list of all ERC721 Tokens owned by an address */
    getOwnersERC721Tokens: Erc721TokenContract
    getPendingTransactions: Array<Maybe<Tx>>
    getTimeseriesData: TimeseriesResponse
    getTimestamp: Scalars['String']
    getTokenInfoByContract: EthTokenInfo
    getTokenInfoByContracts: Array<Maybe<EthTokenInfo>>
    getTokensBeginsWith: Array<Maybe<TokenSearch>>
    getTransactionByHash: Tx
    getTransactionByHashWithTraces: Tx
    getTransactionStateDiff: Array<Maybe<TxStateDiff>>
    /**
     * ------------------------------------------------
     * Transaction:
     * ------------------------------------------------
     */
    getTransactionsByHashes: Array<Maybe<Tx>>
    getUncleByHash: Uncle
    getUncleRewards: EthTransfers
}

export type QueryGetAllEthTransfersArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryGetAllTransfersArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner: Scalars['String']
    types?: InputMaybe<Array<InputMaybe<TransferType>>>
}

export type QueryGetBlockByHashArgs = {
    hash: Scalars['String']
}

export type QueryGetBlockByNumberArgs = {
    number: Scalars['Int']
}

export type QueryGetBlockRewardsArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner: Scalars['String']
}

export type QueryGetBlockTransfersArgs = {
    number?: InputMaybe<Scalars['Int']>
}

export type QueryGetBlocksArrayByNumberArgs = {
    fromBlock?: InputMaybe<Scalars['Int']>
    limit?: InputMaybe<Scalars['Int']>
}

export type QueryGetContractMetaArgs = {
    contract: Scalars['String']
}

export type QueryGetErc20TokenBalanceArgs = {
    contract: Scalars['String']
    owner: Scalars['String']
}

export type QueryGetErc20TokenOwnersArgs = {
    contract: Scalars['String']
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryGetErc20TokenTransfersArgs = {
    contract: Scalars['String']
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryGetErc20TransfersArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner: Scalars['String']
}

export type QueryGetErc721TokenBalanceArgs = {
    contract: Scalars['String']
    owner: Scalars['String']
}

export type QueryGetErc721TokenOwnersArgs = {
    contract: Scalars['String']
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryGetErc721TokenTransfersArgs = {
    contract: Scalars['String']
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryGetErc721TransfersArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner: Scalars['String']
}

export type QueryGetEthBalanceArgs = {
    owner: Scalars['String']
}

export type QueryGetEthOwnersArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryGetEthSigsArgs = {
    sigs: Array<InputMaybe<Scalars['String']>>
}

export type QueryGetEthTransfersArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner: Scalars['String']
}

export type QueryGetEthTransfersV2Args = {
    filter?: InputMaybe<TransferFilter>
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
}

export type QueryGetGenesisRewardsArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner: Scalars['String']
}

export type QueryGetHashTypeArgs = {
    hash: Scalars['String']
}

export type QueryGetNfTcontractsMetaArgs = {
    address: Scalars['String']
}

export type QueryGetOwnersErc20TokensArgs = {
    nextKey?: InputMaybe<Scalars['String']>
    owner: Scalars['String']
}

export type QueryGetOwnersErc721BalancesArgs = {
    owner: Scalars['String']
}

export type QueryGetOwnersErc721TokensArgs = {
    contract?: InputMaybe<Scalars['String']>
    nextKey?: InputMaybe<Scalars['String']>
    owner: Scalars['String']
}

export type QueryGetPendingTransactionsArgs = {
    owner: Scalars['String']
}

export type QueryGetTimeseriesDataArgs = {
    fromT: Scalars['Int']
    key: Scalars['String']
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
    scale: TimeseriesScale
    toT?: InputMaybe<Scalars['Int']>
}

export type QueryGetTokenInfoByContractArgs = {
    contract: Scalars['String']
}

export type QueryGetTokenInfoByContractsArgs = {
    contracts: Array<InputMaybe<Scalars['String']>>
}

export type QueryGetTokensBeginsWithArgs = {
    keyword: Scalars['String']
}

export type QueryGetTransactionByHashArgs = {
    hash: Scalars['String']
}

export type QueryGetTransactionByHashWithTracesArgs = {
    hash: Scalars['String']
}

export type QueryGetTransactionStateDiffArgs = {
    hash: Scalars['String']
}

export type QueryGetTransactionsByHashesArgs = {
    hashes: Array<InputMaybe<Scalars['String']>>
}

export type QueryGetUncleByHashArgs = {
    hash: Scalars['String']
}

export type QueryGetUncleRewardsArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner: Scalars['String']
}

export type StateDiffChange = {
    __typename?: 'StateDiffChange'
    from?: Maybe<BalanceDiff>
    to: BalanceDiff
}

export type Subscription = {
    __typename?: 'Subscription'
    addressEvent: AddressEvent
    minedTransaction: MinedTransfer
    newBlockFeed: BlockSummary
    newTransfersCompleteFeed: TransferComplete
    pendingTransaction: PendingTransfer
    timeseriesEvent: TimeseriesEvent
    transactionEvent: Scalars['String']
}

export type SubscriptionAddressEventArgs = {
    event?: InputMaybe<AddressEventType>
    owner: Scalars['String']
}

export type SubscriptionMinedTransactionArgs = {
    owner?: InputMaybe<Scalars['String']>
}

export type SubscriptionPendingTransactionArgs = {
    owner?: InputMaybe<Scalars['String']>
}

export type SubscriptionTimeseriesEventArgs = {
    key: Scalars['String']
    scale: TimeseriesScale
}

export type SubscriptionTransactionEventArgs = {
    hash: Scalars['String']
}

export type TimeseriesData = {
    __typename?: 'TimeseriesData'
    timestamp: Scalars['Int']
    value: Scalars['String']
}

export type TimeseriesEvent = {
    __typename?: 'TimeseriesEvent'
    item: TimeseriesData
    key: Scalars['String']
    scale: TimeseriesScale
}

export enum TimeseriesKey {
    AccountBalancePrefixAvg = 'ACCOUNT_BALANCE_PREFIX_AVG',
    AccountBalancePrefixMax = 'ACCOUNT_BALANCE_PREFIX_MAX',
    AccountBalancePrefixMin = 'ACCOUNT_BALANCE_PREFIX_MIN',
    AccountGasPricePrefixAvg = 'ACCOUNT_GAS_PRICE_PREFIX_AVG',
    AccountGasPricePrefixMax = 'ACCOUNT_GAS_PRICE_PREFIX_MAX',
    AccountGasPricePrefixMin = 'ACCOUNT_GAS_PRICE_PREFIX_MIN',
    AccountTxFeesPrefixTotal = 'ACCOUNT_TX_FEES_PREFIX_TOTAL',
    BlockBaseFeeAvg = 'BLOCK_BASE_FEE_AVG',
    BlockBaseFeeMax = 'BLOCK_BASE_FEE_MAX',
    BlockBaseFeeMin = 'BLOCK_BASE_FEE_MIN',
    BlockDifficultyAvg = 'BLOCK_DIFFICULTY_AVG',
    BlockDifficultyMax = 'BLOCK_DIFFICULTY_MAX',
    BlockDifficultyMin = 'BLOCK_DIFFICULTY_MIN',
    BlockDifficultyTotal = 'BLOCK_DIFFICULTY_TOTAL',
    BlockFailedTxsAvg = 'BLOCK_FAILED_TXS_AVG',
    BlockFailedTxsMax = 'BLOCK_FAILED_TXS_MAX',
    BlockFailedTxsMin = 'BLOCK_FAILED_TXS_MIN',
    BlockFailedTxsTotal = 'BLOCK_FAILED_TXS_TOTAL',
    BlockGasLimitAvg = 'BLOCK_GAS_LIMIT_AVG',
    BlockGasLimitMax = 'BLOCK_GAS_LIMIT_MAX',
    BlockGasLimitMin = 'BLOCK_GAS_LIMIT_MIN',
    BlockGasLimitTotal = 'BLOCK_GAS_LIMIT_TOTAL',
    BlockRewardsAvg = 'BLOCK_REWARDS_AVG',
    BlockRewardsMax = 'BLOCK_REWARDS_MAX',
    BlockRewardsMin = 'BLOCK_REWARDS_MIN',
    BlockRewardsTotal = 'BLOCK_REWARDS_TOTAL',
    BlockSizeAvg = 'BLOCK_SIZE_AVG',
    BlockSizeMax = 'BLOCK_SIZE_MAX',
    BlockSizeMin = 'BLOCK_SIZE_MIN',
    BlockSizeTotal = 'BLOCK_SIZE_TOTAL',
    BlockSuccessTxsAvg = 'BLOCK_SUCCESS_TXS_AVG',
    BlockSuccessTxsMax = 'BLOCK_SUCCESS_TXS_MAX',
    BlockSuccessTxsMin = 'BLOCK_SUCCESS_TXS_MIN',
    BlockSuccessTxsTotal = 'BLOCK_SUCCESS_TXS_TOTAL',
    BlockUnclesAvg = 'BLOCK_UNCLES_AVG',
    BlockUnclesMax = 'BLOCK_UNCLES_MAX',
    BlockUnclesMin = 'BLOCK_UNCLES_MIN',
    BlockUnclesTotal = 'BLOCK_UNCLES_TOTAL',
    BlockUncleRewardsAvg = 'BLOCK_UNCLE_REWARDS_AVG',
    BlockUncleRewardsMax = 'BLOCK_UNCLE_REWARDS_MAX',
    BlockUncleRewardsMin = 'BLOCK_UNCLE_REWARDS_MIN',
    BlockUncleRewardsTotal = 'BLOCK_UNCLE_REWARDS_TOTAL',
    GasBurntAvg = 'GAS_BURNT_AVG',
    GasBurntMax = 'GAS_BURNT_MAX',
    GasBurntMin = 'GAS_BURNT_MIN',
    GasBurntTotal = 'GAS_BURNT_TOTAL',
    GasCostAvg = 'GAS_COST_AVG',
    GasCostMax = 'GAS_COST_MAX',
    GasCostMin = 'GAS_COST_MIN',
    GasCostTotal = 'GAS_COST_TOTAL',
    GasPriceAvg = 'GAS_PRICE_AVG',
    GasPriceMax = 'GAS_PRICE_MAX',
    GasPriceMin = 'GAS_PRICE_MIN',
    GasPriorityFeesAvg = 'GAS_PRIORITY_FEES_AVG',
    GasPriorityFeesMax = 'GAS_PRIORITY_FEES_MAX',
    GasPriorityFeesMin = 'GAS_PRIORITY_FEES_MIN',
    PendingTxCountAvg = 'PENDING_TX_COUNT_AVG',
    PendingTxCountTotal = 'PENDING_TX_COUNT_TOTAL',
    TxCountAvg = 'TX_COUNT_AVG',
    TxCountMax = 'TX_COUNT_MAX',
    TxCountMin = 'TX_COUNT_MIN',
    TxCountTotal = 'TX_COUNT_TOTAL'
}

export type TimeseriesResponse = {
    __typename?: 'TimeseriesResponse'
    items: Array<Maybe<TimeseriesData>>
    nextKey?: Maybe<Scalars['String']>
}

export enum TimeseriesScale {
    Days = 'days',
    Hours = 'hours',
    Minutes = 'minutes',
    Seconds = 'seconds'
}

export type TokenMarketInfo = {
    __typename?: 'TokenMarketInfo'
    ath?: Maybe<Scalars['Float']>
    ath_change_percentage?: Maybe<Scalars['Float']>
    ath_date?: Maybe<Scalars['String']>
    atl?: Maybe<Scalars['Float']>
    atl_change_percentage?: Maybe<Scalars['Float']>
    atl_date?: Maybe<Scalars['String']>
    circulating_supply?: Maybe<Scalars['Float']>
    contract?: Maybe<Scalars['String']>
    current_price?: Maybe<Scalars['Float']>
    high_24h?: Maybe<Scalars['Float']>
    id: Scalars['String']
    image: Scalars['String']
    last_updated?: Maybe<Scalars['String']>
    low_24h?: Maybe<Scalars['Float']>
    market_cap?: Maybe<Scalars['Float']>
    market_cap_change_24h?: Maybe<Scalars['Float']>
    market_cap_change_percentage_24h?: Maybe<Scalars['Float']>
    market_cap_rank?: Maybe<Scalars['Int']>
    name: Scalars['String']
    price_change_24h?: Maybe<Scalars['Float']>
    price_change_percentage_24h?: Maybe<Scalars['Float']>
    symbol: Scalars['String']
    total_supply?: Maybe<Scalars['String']>
    total_volume?: Maybe<Scalars['Float']>
}

export type TokenSearch = {
    __typename?: 'TokenSearch'
    contract: Scalars['String']
    keyword: Scalars['String']
}

export type Trace = {
    __typename?: 'Trace'
    action?: Maybe<TraceAction>
    result?: Maybe<TraceResult>
    subtraces?: Maybe<Scalars['Int']>
    traceAddress?: Maybe<Array<Scalars['Int']>>
    transactionPosition?: Maybe<Scalars['Int']>
    type?: Maybe<Scalars['String']>
}

export type TraceAction = {
    __typename?: 'TraceAction'
    callType?: Maybe<Scalars['String']>
    from?: Maybe<Scalars['String']>
    gas?: Maybe<Scalars['String']>
    input?: Maybe<Scalars['String']>
    to?: Maybe<Scalars['String']>
    value?: Maybe<Scalars['String']>
}

export type TraceResult = {
    __typename?: 'TraceResult'
    gasUsed?: Maybe<Scalars['String']>
    output?: Maybe<Scalars['String']>
}

export type Transfer = {
    __typename?: 'Transfer'
    block: Scalars['Int']
    from: Scalars['String']
    status?: Maybe<Scalars['Boolean']>
    timestamp: Scalars['Int']
    to: Scalars['String']
    transactionHash: Scalars['String']
    txFee: Scalars['String']
}

export type TransferComplete = {
    __typename?: 'TransferComplete'
    block: Scalars['Int']
    type: TransferType
}

export enum TransferFilter {
    From = 'FROM',
    To = 'TO'
}

export enum TransferType {
    Erc20 = 'ERC20',
    Erc721 = 'ERC721',
    Eth = 'ETH'
}

export type Tx = {
    __typename?: 'Tx'
    baseFeePerGas?: Maybe<Scalars['String']>
    blockHash?: Maybe<Scalars['String']>
    blockNumber?: Maybe<Scalars['Int']>
    contractAddress?: Maybe<Scalars['String']>
    from: Scalars['String']
    gas: Scalars['String']
    gasPrice: Scalars['String']
    gasUsed?: Maybe<Scalars['String']>
    hash: Scalars['String']
    input: Scalars['String']
    logs: Array<Log>
    maxFeePerGas?: Maybe<Scalars['String']>
    maxPriorityFeePerGas?: Maybe<Scalars['String']>
    nonce: Scalars['Int']
    r: Scalars['String']
    replacedBy?: Maybe<Scalars['String']>
    s: Scalars['String']
    status?: Maybe<Scalars['String']>
    timestamp?: Maybe<Scalars['Int']>
    to?: Maybe<Scalars['String']>
    trace?: Maybe<Array<Trace>>
    transactionIndex?: Maybe<Scalars['Int']>
    v: Scalars['String']
    value: Scalars['String']
}

export type TxStateDiff = {
    __typename?: 'TxStateDiff'
    from: Scalars['String']
    owner: Scalars['String']
    to: Scalars['String']
}

export type Uncle = {
    __typename?: 'Uncle'
    block: Block
    parentBlockNumber: Scalars['Int']
    parentHash: Scalars['String']
    unclePosition: Scalars['Int']
}

export type MinedTransfer = {
    __typename?: 'minedTransfer'
    from: Scalars['String']
    timestamp: Scalars['Int']
    to?: Maybe<Scalars['String']>
    transactionHash: Scalars['String']
    txFee: Scalars['String']
    value: Scalars['String']
}
