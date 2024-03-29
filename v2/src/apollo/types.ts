/** * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY. */

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
    BigDecimal: string
    BigInt: string
    Bytes: string
    EthVMCurrencyFloat: number
    /**
     * Prefixed hex non-empty hex string that can be preceeded by a "-".
     *
     * Regex: ^-?0x[0-9a-fA-F]+$
     *
     * Negative numbers are represented with a "-" infront of the hex prefix.
     */
    EthVMIntHex: string
    EthVMIso8601DateTimeMilliseconds: string
    EthVMPrefixedBase16String: string
    EthVMPrefixedEthereumAddress: string
    EthVMPrefixedHexString: string
    EthVMTransactionHash: string
    /**
     * Prefixed hex non-empty hex string.
     *
     * Regex: ^0x[0-9a-fA-F]+$
     */
    EthVMUintHex: string
    EthVMUnixEpochMilliseconds: number
    EthVMUnixEpochSeconds: number
    EthVMUrl: string
    /**
     * 8 bytes signed integer
     *
     */
    Int8: string
}

export type AbiChanged = ResolverEvent & {
    __typename?: 'AbiChanged'
    /** The block number at which the event was emitted */
    blockNumber: Scalars['Int']
    /** The content type of the ABI change */
    contentType: Scalars['BigInt']
    /** Concatenation of block number and log ID */
    id: Scalars['ID']
    /** Used to derive relationships to Resolvers */
    resolver: Resolver
    /** The transaction hash of the transaction in which the event was emitted */
    transactionID: Scalars['Bytes']
}

export type AbiChanged_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<AbiChanged_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    contentType?: InputMaybe<Scalars['BigInt']>
    contentType_gt?: InputMaybe<Scalars['BigInt']>
    contentType_gte?: InputMaybe<Scalars['BigInt']>
    contentType_in?: InputMaybe<Array<Scalars['BigInt']>>
    contentType_lt?: InputMaybe<Scalars['BigInt']>
    contentType_lte?: InputMaybe<Scalars['BigInt']>
    contentType_not?: InputMaybe<Scalars['BigInt']>
    contentType_not_in?: InputMaybe<Array<Scalars['BigInt']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<AbiChanged_Filter>>>
    resolver?: InputMaybe<Scalars['String']>
    resolver_?: InputMaybe<Resolver_Filter>
    resolver_contains?: InputMaybe<Scalars['String']>
    resolver_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_ends_with?: InputMaybe<Scalars['String']>
    resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_gt?: InputMaybe<Scalars['String']>
    resolver_gte?: InputMaybe<Scalars['String']>
    resolver_in?: InputMaybe<Array<Scalars['String']>>
    resolver_lt?: InputMaybe<Scalars['String']>
    resolver_lte?: InputMaybe<Scalars['String']>
    resolver_not?: InputMaybe<Scalars['String']>
    resolver_not_contains?: InputMaybe<Scalars['String']>
    resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_not_ends_with?: InputMaybe<Scalars['String']>
    resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_not_in?: InputMaybe<Array<Scalars['String']>>
    resolver_not_starts_with?: InputMaybe<Scalars['String']>
    resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver_starts_with?: InputMaybe<Scalars['String']>
    resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum AbiChanged_OrderBy {
    BlockNumber = 'blockNumber',
    ContentType = 'contentType',
    Id = 'id',
    Resolver = 'resolver',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    TransactionId = 'transactionID'
}

export type Account = {
    __typename?: 'Account'
    /** The domains owned by the account */
    domains: Array<Domain>
    /** The unique identifier for the account */
    id: Scalars['ID']
    /** The Registrations made by the account */
    registrations?: Maybe<Array<Registration>>
    /** The WrappedDomains owned by the account */
    wrappedDomains?: Maybe<Array<WrappedDomain>>
}

export type AccountDomainsArgs = {
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<Domain_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    where?: InputMaybe<Domain_Filter>
}

export type AccountRegistrationsArgs = {
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<Registration_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    where?: InputMaybe<Registration_Filter>
}

export type AccountWrappedDomainsArgs = {
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<WrappedDomain_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    where?: InputMaybe<WrappedDomain_Filter>
}

export type Account_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<Account_Filter>>>
    domains_?: InputMaybe<Domain_Filter>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<Account_Filter>>>
    registrations_?: InputMaybe<Registration_Filter>
    wrappedDomains_?: InputMaybe<WrappedDomain_Filter>
}

export enum Account_OrderBy {
    Domains = 'domains',
    Id = 'id',
    Registrations = 'registrations',
    WrappedDomains = 'wrappedDomains'
}

export type AddrChanged = ResolverEvent & {
    __typename?: 'AddrChanged'
    /** The new address associated with the resolver */
    addr: Account
    /** The block number at which this event occurred */
    blockNumber: Scalars['Int']
    /** Unique identifier for this event */
    id: Scalars['ID']
    /** The resolver associated with this event */
    resolver: Resolver
    /** The transaction ID for the transaction in which this event occurred */
    transactionID: Scalars['Bytes']
}

export type AddrChanged_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    addr?: InputMaybe<Scalars['String']>
    addr_?: InputMaybe<Account_Filter>
    addr_contains?: InputMaybe<Scalars['String']>
    addr_contains_nocase?: InputMaybe<Scalars['String']>
    addr_ends_with?: InputMaybe<Scalars['String']>
    addr_ends_with_nocase?: InputMaybe<Scalars['String']>
    addr_gt?: InputMaybe<Scalars['String']>
    addr_gte?: InputMaybe<Scalars['String']>
    addr_in?: InputMaybe<Array<Scalars['String']>>
    addr_lt?: InputMaybe<Scalars['String']>
    addr_lte?: InputMaybe<Scalars['String']>
    addr_not?: InputMaybe<Scalars['String']>
    addr_not_contains?: InputMaybe<Scalars['String']>
    addr_not_contains_nocase?: InputMaybe<Scalars['String']>
    addr_not_ends_with?: InputMaybe<Scalars['String']>
    addr_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    addr_not_in?: InputMaybe<Array<Scalars['String']>>
    addr_not_starts_with?: InputMaybe<Scalars['String']>
    addr_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    addr_starts_with?: InputMaybe<Scalars['String']>
    addr_starts_with_nocase?: InputMaybe<Scalars['String']>
    and?: InputMaybe<Array<InputMaybe<AddrChanged_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<AddrChanged_Filter>>>
    resolver?: InputMaybe<Scalars['String']>
    resolver_?: InputMaybe<Resolver_Filter>
    resolver_contains?: InputMaybe<Scalars['String']>
    resolver_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_ends_with?: InputMaybe<Scalars['String']>
    resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_gt?: InputMaybe<Scalars['String']>
    resolver_gte?: InputMaybe<Scalars['String']>
    resolver_in?: InputMaybe<Array<Scalars['String']>>
    resolver_lt?: InputMaybe<Scalars['String']>
    resolver_lte?: InputMaybe<Scalars['String']>
    resolver_not?: InputMaybe<Scalars['String']>
    resolver_not_contains?: InputMaybe<Scalars['String']>
    resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_not_ends_with?: InputMaybe<Scalars['String']>
    resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_not_in?: InputMaybe<Array<Scalars['String']>>
    resolver_not_starts_with?: InputMaybe<Scalars['String']>
    resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver_starts_with?: InputMaybe<Scalars['String']>
    resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum AddrChanged_OrderBy {
    Addr = 'addr',
    AddrId = 'addr__id',
    BlockNumber = 'blockNumber',
    Id = 'id',
    Resolver = 'resolver',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    TransactionId = 'transactionID'
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
    NewErc1155Transfer = 'NEW_ERC1155_TRANSFER',
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
    tokenId?: Maybe<Scalars['String']>
    tokenInfo?: Maybe<EthTokenInfo>
    transfer: Transfer
    value?: Maybe<Scalars['String']>
}

export type AllTransferWithError = {
    __typename?: 'AllTransferWithError'
    contract?: Maybe<Scalars['String']>
    stateDiff?: Maybe<StateDiffChange>
    tokenId?: Maybe<Scalars['String']>
    tokenInfo?: Maybe<EthTokenInfo>
    transfer: TransferWithError
    value?: Maybe<Scalars['String']>
}

export type AllTransfers = {
    __typename?: 'AllTransfers'
    nextKey?: Maybe<Scalars['String']>
    transfers: Array<Maybe<AllTransfer>>
}

export type AllTransfersWithErrors = {
    __typename?: 'AllTransfersWithErrors'
    nextKey?: Maybe<Scalars['String']>
    transfers: Array<Maybe<AllTransferWithError>>
}

export type AuthorisationChanged = ResolverEvent & {
    __typename?: 'AuthorisationChanged'
    /** The block number at which the event occurred */
    blockNumber: Scalars['Int']
    /** Unique identifier for this event */
    id: Scalars['ID']
    /** Whether the authorisation was added or removed */
    isAuthorized: Scalars['Boolean']
    /** The owner of the authorisation */
    owner: Scalars['Bytes']
    /** The resolver associated with this event */
    resolver: Resolver
    /** The target of the authorisation */
    target: Scalars['Bytes']
    /** The transaction hash associated with the event */
    transactionID: Scalars['Bytes']
}

export type AuthorisationChanged_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<AuthorisationChanged_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    isAuthorized?: InputMaybe<Scalars['Boolean']>
    isAuthorized_in?: InputMaybe<Array<Scalars['Boolean']>>
    isAuthorized_not?: InputMaybe<Scalars['Boolean']>
    isAuthorized_not_in?: InputMaybe<Array<Scalars['Boolean']>>
    or?: InputMaybe<Array<InputMaybe<AuthorisationChanged_Filter>>>
    owner?: InputMaybe<Scalars['Bytes']>
    owner_contains?: InputMaybe<Scalars['Bytes']>
    owner_gt?: InputMaybe<Scalars['Bytes']>
    owner_gte?: InputMaybe<Scalars['Bytes']>
    owner_in?: InputMaybe<Array<Scalars['Bytes']>>
    owner_lt?: InputMaybe<Scalars['Bytes']>
    owner_lte?: InputMaybe<Scalars['Bytes']>
    owner_not?: InputMaybe<Scalars['Bytes']>
    owner_not_contains?: InputMaybe<Scalars['Bytes']>
    owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    resolver?: InputMaybe<Scalars['String']>
    resolver_?: InputMaybe<Resolver_Filter>
    resolver_contains?: InputMaybe<Scalars['String']>
    resolver_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_ends_with?: InputMaybe<Scalars['String']>
    resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_gt?: InputMaybe<Scalars['String']>
    resolver_gte?: InputMaybe<Scalars['String']>
    resolver_in?: InputMaybe<Array<Scalars['String']>>
    resolver_lt?: InputMaybe<Scalars['String']>
    resolver_lte?: InputMaybe<Scalars['String']>
    resolver_not?: InputMaybe<Scalars['String']>
    resolver_not_contains?: InputMaybe<Scalars['String']>
    resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_not_ends_with?: InputMaybe<Scalars['String']>
    resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_not_in?: InputMaybe<Array<Scalars['String']>>
    resolver_not_starts_with?: InputMaybe<Scalars['String']>
    resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver_starts_with?: InputMaybe<Scalars['String']>
    resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
    target?: InputMaybe<Scalars['Bytes']>
    target_contains?: InputMaybe<Scalars['Bytes']>
    target_gt?: InputMaybe<Scalars['Bytes']>
    target_gte?: InputMaybe<Scalars['Bytes']>
    target_in?: InputMaybe<Array<Scalars['Bytes']>>
    target_lt?: InputMaybe<Scalars['Bytes']>
    target_lte?: InputMaybe<Scalars['Bytes']>
    target_not?: InputMaybe<Scalars['Bytes']>
    target_not_contains?: InputMaybe<Scalars['Bytes']>
    target_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum AuthorisationChanged_OrderBy {
    BlockNumber = 'blockNumber',
    Id = 'id',
    IsAuthorized = 'isAuthorized',
    Owner = 'owner',
    Resolver = 'resolver',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    Target = 'target',
    TransactionId = 'transactionID'
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
    withdrawalCount: Scalars['Int']
}

export type BlockChangedFilter = {
    number_gte: Scalars['Int']
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
    baseFeePerGas?: Maybe<Scalars['String']>
    miner: Scalars['String']
    number: Scalars['Int']
    rewards: BlockRewards
    timestamp: Scalars['Int']
    txCount: Scalars['Int']
    txFail: Scalars['Int']
    uncles: Array<Maybe<Scalars['String']>>
}

export type Block_Height = {
    hash?: InputMaybe<Scalars['Bytes']>
    number?: InputMaybe<Scalars['Int']>
    number_gte?: InputMaybe<Scalars['Int']>
}

export type CoinGeckoTokenInfo = {
    __typename?: 'CoinGeckoTokenInfo'
    id: Scalars['String']
    last_updated_iso8601: Scalars['String']
    name: Scalars['String']
    platforms: Array<CoinGeckoTokenInfoItemPlatform>
    symbol: Scalars['String']
}

export type CoinGeckoTokenInfoItemPlatform = {
    __typename?: 'CoinGeckoTokenInfoItemPlatform'
    address?: Maybe<Scalars['String']>
    platform: Scalars['String']
}

export type CoinGeckoTokenMarketDataItem = {
    __typename?: 'CoinGeckoTokenMarketDataItem'
    ath?: Maybe<Scalars['Float']>
    ath_change_percentage?: Maybe<Scalars['Float']>
    ath_date?: Maybe<Scalars['String']>
    atl?: Maybe<Scalars['Float']>
    atl_change_percentage?: Maybe<Scalars['Float']>
    atl_date?: Maybe<Scalars['String']>
    circulating_supply?: Maybe<Scalars['Float']>
    current_price?: Maybe<Scalars['Float']>
    fully_diluted_valuation?: Maybe<Scalars['Float']>
    high_24h?: Maybe<Scalars['Float']>
    id: Scalars['String']
    image?: Maybe<Scalars['String']>
    last_updated_iso8601?: Maybe<Scalars['String']>
    low_24h?: Maybe<Scalars['Float']>
    market_cap?: Maybe<Scalars['Float']>
    market_cap_change_24h?: Maybe<Scalars['Float']>
    market_cap_change_percentage_24h?: Maybe<Scalars['Float']>
    market_cap_rank?: Maybe<Scalars['Float']>
    max_supply?: Maybe<Scalars['Float']>
    name?: Maybe<Scalars['String']>
    price_change_24h?: Maybe<Scalars['Float']>
    price_change_percentage_1h_in_currency?: Maybe<Scalars['Float']>
    price_change_percentage_1y_in_currency?: Maybe<Scalars['Float']>
    price_change_percentage_7d_in_currency?: Maybe<Scalars['Float']>
    price_change_percentage_14d_in_currency?: Maybe<Scalars['Float']>
    price_change_percentage_24h?: Maybe<Scalars['Float']>
    price_change_percentage_24h_in_currency?: Maybe<Scalars['Float']>
    price_change_percentage_30d_in_currency?: Maybe<Scalars['Float']>
    price_change_percentage_200d_in_currency?: Maybe<Scalars['Float']>
    roi?: Maybe<CoinGeckoTokenMarketDataItemRoi>
    sparkline_in_7d: CoinGeckoTokenMarketDataItemSparkline
    symbol?: Maybe<Scalars['String']>
    total_supply?: Maybe<Scalars['Float']>
    total_volume?: Maybe<Scalars['Float']>
}

export type CoinGeckoTokenMarketDataItemRoi = {
    __typename?: 'CoinGeckoTokenMarketDataItemRoi'
    currency?: Maybe<Scalars['String']>
    percentage?: Maybe<Scalars['Float']>
    times?: Maybe<Scalars['Float']>
}

export type CoinGeckoTokenMarketDataItemSparkline = {
    __typename?: 'CoinGeckoTokenMarketDataItemSparkline'
    price: Array<Scalars['Float']>
}

export type CoinGeckoTokenPrice = {
    __typename?: 'CoinGeckoTokenPrice'
    id: Scalars['String']
    last_updated_iso8601?: Maybe<Scalars['String']>
    usd?: Maybe<Scalars['Float']>
}

export type ContenthashChanged = ResolverEvent & {
    __typename?: 'ContenthashChanged'
    /** The block number where the event occurred */
    blockNumber: Scalars['Int']
    /** The new content hash for the domain */
    hash: Scalars['Bytes']
    /** Concatenation of block number and log ID */
    id: Scalars['ID']
    /** Used to derive relationships to Resolvers */
    resolver: Resolver
    /** The ID of the transaction where the event occurred */
    transactionID: Scalars['Bytes']
}

export type ContenthashChanged_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<ContenthashChanged_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    hash?: InputMaybe<Scalars['Bytes']>
    hash_contains?: InputMaybe<Scalars['Bytes']>
    hash_gt?: InputMaybe<Scalars['Bytes']>
    hash_gte?: InputMaybe<Scalars['Bytes']>
    hash_in?: InputMaybe<Array<Scalars['Bytes']>>
    hash_lt?: InputMaybe<Scalars['Bytes']>
    hash_lte?: InputMaybe<Scalars['Bytes']>
    hash_not?: InputMaybe<Scalars['Bytes']>
    hash_not_contains?: InputMaybe<Scalars['Bytes']>
    hash_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<ContenthashChanged_Filter>>>
    resolver?: InputMaybe<Scalars['String']>
    resolver_?: InputMaybe<Resolver_Filter>
    resolver_contains?: InputMaybe<Scalars['String']>
    resolver_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_ends_with?: InputMaybe<Scalars['String']>
    resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_gt?: InputMaybe<Scalars['String']>
    resolver_gte?: InputMaybe<Scalars['String']>
    resolver_in?: InputMaybe<Array<Scalars['String']>>
    resolver_lt?: InputMaybe<Scalars['String']>
    resolver_lte?: InputMaybe<Scalars['String']>
    resolver_not?: InputMaybe<Scalars['String']>
    resolver_not_contains?: InputMaybe<Scalars['String']>
    resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_not_ends_with?: InputMaybe<Scalars['String']>
    resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_not_in?: InputMaybe<Array<Scalars['String']>>
    resolver_not_starts_with?: InputMaybe<Scalars['String']>
    resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver_starts_with?: InputMaybe<Scalars['String']>
    resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum ContenthashChanged_OrderBy {
    BlockNumber = 'blockNumber',
    Hash = 'hash',
    Id = 'id',
    Resolver = 'resolver',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    TransactionId = 'transactionID'
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

export type Domain = {
    __typename?: 'Domain'
    /** The time when the domain was created */
    createdAt: Scalars['BigInt']
    /** The events associated with the domain */
    events: Array<DomainEvent>
    /** The expiry date for the domain, from either the registration, or the wrapped domain if PCC is burned */
    expiryDate?: Maybe<Scalars['BigInt']>
    /** The namehash of the name */
    id: Scalars['ID']
    /** Indicates whether the domain has been migrated to a new registrar */
    isMigrated: Scalars['Boolean']
    /** The human readable label name (imported from CSV), if known */
    labelName?: Maybe<Scalars['String']>
    /** keccak256(labelName) */
    labelhash?: Maybe<Scalars['Bytes']>
    /** The human readable name, if known. Unknown portions replaced with hash in square brackets (eg, foo.[1234].eth) */
    name?: Maybe<Scalars['String']>
    /** The account that owns the domain */
    owner: Account
    /** The namehash (id) of the parent name */
    parent?: Maybe<Domain>
    /** The account that owns the ERC721 NFT for the domain */
    registrant?: Maybe<Account>
    /** The registration associated with the domain */
    registration?: Maybe<Registration>
    /** Address logged from current resolver, if any */
    resolvedAddress?: Maybe<Account>
    /** The resolver that controls the domain's settings */
    resolver?: Maybe<Resolver>
    /** The number of subdomains */
    subdomainCount: Scalars['Int']
    /** Can count domains from length of array */
    subdomains: Array<Domain>
    /** The time-to-live (TTL) value of the domain's records */
    ttl?: Maybe<Scalars['BigInt']>
    /** The wrapped domain associated with the domain */
    wrappedDomain?: Maybe<WrappedDomain>
    /** The account that owns the wrapped domain */
    wrappedOwner?: Maybe<Account>
}

export type DomainEventsArgs = {
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<DomainEvent_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    where?: InputMaybe<DomainEvent_Filter>
}

export type DomainSubdomainsArgs = {
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<Domain_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    where?: InputMaybe<Domain_Filter>
}

export type DomainEvent = {
    /** The block number at which the event occurred */
    blockNumber: Scalars['Int']
    /** The domain name associated with the event */
    domain: Domain
    /** The unique identifier of the event */
    id: Scalars['ID']
    /** The transaction hash of the transaction that triggered the event */
    transactionID: Scalars['Bytes']
}

export type DomainEvent_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<DomainEvent_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    domain?: InputMaybe<Scalars['String']>
    domain_?: InputMaybe<Domain_Filter>
    domain_contains?: InputMaybe<Scalars['String']>
    domain_contains_nocase?: InputMaybe<Scalars['String']>
    domain_ends_with?: InputMaybe<Scalars['String']>
    domain_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_gt?: InputMaybe<Scalars['String']>
    domain_gte?: InputMaybe<Scalars['String']>
    domain_in?: InputMaybe<Array<Scalars['String']>>
    domain_lt?: InputMaybe<Scalars['String']>
    domain_lte?: InputMaybe<Scalars['String']>
    domain_not?: InputMaybe<Scalars['String']>
    domain_not_contains?: InputMaybe<Scalars['String']>
    domain_not_contains_nocase?: InputMaybe<Scalars['String']>
    domain_not_ends_with?: InputMaybe<Scalars['String']>
    domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_not_in?: InputMaybe<Array<Scalars['String']>>
    domain_not_starts_with?: InputMaybe<Scalars['String']>
    domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    domain_starts_with?: InputMaybe<Scalars['String']>
    domain_starts_with_nocase?: InputMaybe<Scalars['String']>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<DomainEvent_Filter>>>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum DomainEvent_OrderBy {
    BlockNumber = 'blockNumber',
    Domain = 'domain',
    DomainCreatedAt = 'domain__createdAt',
    DomainExpiryDate = 'domain__expiryDate',
    DomainId = 'domain__id',
    DomainIsMigrated = 'domain__isMigrated',
    DomainLabelName = 'domain__labelName',
    DomainLabelhash = 'domain__labelhash',
    DomainName = 'domain__name',
    DomainSubdomainCount = 'domain__subdomainCount',
    DomainTtl = 'domain__ttl',
    Id = 'id',
    TransactionId = 'transactionID'
}

export type Domain_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<Domain_Filter>>>
    createdAt?: InputMaybe<Scalars['BigInt']>
    createdAt_gt?: InputMaybe<Scalars['BigInt']>
    createdAt_gte?: InputMaybe<Scalars['BigInt']>
    createdAt_in?: InputMaybe<Array<Scalars['BigInt']>>
    createdAt_lt?: InputMaybe<Scalars['BigInt']>
    createdAt_lte?: InputMaybe<Scalars['BigInt']>
    createdAt_not?: InputMaybe<Scalars['BigInt']>
    createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>
    events_?: InputMaybe<DomainEvent_Filter>
    expiryDate?: InputMaybe<Scalars['BigInt']>
    expiryDate_gt?: InputMaybe<Scalars['BigInt']>
    expiryDate_gte?: InputMaybe<Scalars['BigInt']>
    expiryDate_in?: InputMaybe<Array<Scalars['BigInt']>>
    expiryDate_lt?: InputMaybe<Scalars['BigInt']>
    expiryDate_lte?: InputMaybe<Scalars['BigInt']>
    expiryDate_not?: InputMaybe<Scalars['BigInt']>
    expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    isMigrated?: InputMaybe<Scalars['Boolean']>
    isMigrated_in?: InputMaybe<Array<Scalars['Boolean']>>
    isMigrated_not?: InputMaybe<Scalars['Boolean']>
    isMigrated_not_in?: InputMaybe<Array<Scalars['Boolean']>>
    labelName?: InputMaybe<Scalars['String']>
    labelName_contains?: InputMaybe<Scalars['String']>
    labelName_contains_nocase?: InputMaybe<Scalars['String']>
    labelName_ends_with?: InputMaybe<Scalars['String']>
    labelName_ends_with_nocase?: InputMaybe<Scalars['String']>
    labelName_gt?: InputMaybe<Scalars['String']>
    labelName_gte?: InputMaybe<Scalars['String']>
    labelName_in?: InputMaybe<Array<Scalars['String']>>
    labelName_lt?: InputMaybe<Scalars['String']>
    labelName_lte?: InputMaybe<Scalars['String']>
    labelName_not?: InputMaybe<Scalars['String']>
    labelName_not_contains?: InputMaybe<Scalars['String']>
    labelName_not_contains_nocase?: InputMaybe<Scalars['String']>
    labelName_not_ends_with?: InputMaybe<Scalars['String']>
    labelName_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    labelName_not_in?: InputMaybe<Array<Scalars['String']>>
    labelName_not_starts_with?: InputMaybe<Scalars['String']>
    labelName_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    labelName_starts_with?: InputMaybe<Scalars['String']>
    labelName_starts_with_nocase?: InputMaybe<Scalars['String']>
    labelhash?: InputMaybe<Scalars['Bytes']>
    labelhash_contains?: InputMaybe<Scalars['Bytes']>
    labelhash_gt?: InputMaybe<Scalars['Bytes']>
    labelhash_gte?: InputMaybe<Scalars['Bytes']>
    labelhash_in?: InputMaybe<Array<Scalars['Bytes']>>
    labelhash_lt?: InputMaybe<Scalars['Bytes']>
    labelhash_lte?: InputMaybe<Scalars['Bytes']>
    labelhash_not?: InputMaybe<Scalars['Bytes']>
    labelhash_not_contains?: InputMaybe<Scalars['Bytes']>
    labelhash_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    name?: InputMaybe<Scalars['String']>
    name_contains?: InputMaybe<Scalars['String']>
    name_contains_nocase?: InputMaybe<Scalars['String']>
    name_ends_with?: InputMaybe<Scalars['String']>
    name_ends_with_nocase?: InputMaybe<Scalars['String']>
    name_gt?: InputMaybe<Scalars['String']>
    name_gte?: InputMaybe<Scalars['String']>
    name_in?: InputMaybe<Array<Scalars['String']>>
    name_lt?: InputMaybe<Scalars['String']>
    name_lte?: InputMaybe<Scalars['String']>
    name_not?: InputMaybe<Scalars['String']>
    name_not_contains?: InputMaybe<Scalars['String']>
    name_not_contains_nocase?: InputMaybe<Scalars['String']>
    name_not_ends_with?: InputMaybe<Scalars['String']>
    name_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    name_not_in?: InputMaybe<Array<Scalars['String']>>
    name_not_starts_with?: InputMaybe<Scalars['String']>
    name_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    name_starts_with?: InputMaybe<Scalars['String']>
    name_starts_with_nocase?: InputMaybe<Scalars['String']>
    or?: InputMaybe<Array<InputMaybe<Domain_Filter>>>
    owner?: InputMaybe<Scalars['String']>
    owner_?: InputMaybe<Account_Filter>
    owner_contains?: InputMaybe<Scalars['String']>
    owner_contains_nocase?: InputMaybe<Scalars['String']>
    owner_ends_with?: InputMaybe<Scalars['String']>
    owner_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_gt?: InputMaybe<Scalars['String']>
    owner_gte?: InputMaybe<Scalars['String']>
    owner_in?: InputMaybe<Array<Scalars['String']>>
    owner_lt?: InputMaybe<Scalars['String']>
    owner_lte?: InputMaybe<Scalars['String']>
    owner_not?: InputMaybe<Scalars['String']>
    owner_not_contains?: InputMaybe<Scalars['String']>
    owner_not_contains_nocase?: InputMaybe<Scalars['String']>
    owner_not_ends_with?: InputMaybe<Scalars['String']>
    owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_not_in?: InputMaybe<Array<Scalars['String']>>
    owner_not_starts_with?: InputMaybe<Scalars['String']>
    owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    owner_starts_with?: InputMaybe<Scalars['String']>
    owner_starts_with_nocase?: InputMaybe<Scalars['String']>
    parent?: InputMaybe<Scalars['String']>
    parent_?: InputMaybe<Domain_Filter>
    parent_contains?: InputMaybe<Scalars['String']>
    parent_contains_nocase?: InputMaybe<Scalars['String']>
    parent_ends_with?: InputMaybe<Scalars['String']>
    parent_ends_with_nocase?: InputMaybe<Scalars['String']>
    parent_gt?: InputMaybe<Scalars['String']>
    parent_gte?: InputMaybe<Scalars['String']>
    parent_in?: InputMaybe<Array<Scalars['String']>>
    parent_lt?: InputMaybe<Scalars['String']>
    parent_lte?: InputMaybe<Scalars['String']>
    parent_not?: InputMaybe<Scalars['String']>
    parent_not_contains?: InputMaybe<Scalars['String']>
    parent_not_contains_nocase?: InputMaybe<Scalars['String']>
    parent_not_ends_with?: InputMaybe<Scalars['String']>
    parent_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    parent_not_in?: InputMaybe<Array<Scalars['String']>>
    parent_not_starts_with?: InputMaybe<Scalars['String']>
    parent_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    parent_starts_with?: InputMaybe<Scalars['String']>
    parent_starts_with_nocase?: InputMaybe<Scalars['String']>
    registrant?: InputMaybe<Scalars['String']>
    registrant_?: InputMaybe<Account_Filter>
    registrant_contains?: InputMaybe<Scalars['String']>
    registrant_contains_nocase?: InputMaybe<Scalars['String']>
    registrant_ends_with?: InputMaybe<Scalars['String']>
    registrant_ends_with_nocase?: InputMaybe<Scalars['String']>
    registrant_gt?: InputMaybe<Scalars['String']>
    registrant_gte?: InputMaybe<Scalars['String']>
    registrant_in?: InputMaybe<Array<Scalars['String']>>
    registrant_lt?: InputMaybe<Scalars['String']>
    registrant_lte?: InputMaybe<Scalars['String']>
    registrant_not?: InputMaybe<Scalars['String']>
    registrant_not_contains?: InputMaybe<Scalars['String']>
    registrant_not_contains_nocase?: InputMaybe<Scalars['String']>
    registrant_not_ends_with?: InputMaybe<Scalars['String']>
    registrant_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    registrant_not_in?: InputMaybe<Array<Scalars['String']>>
    registrant_not_starts_with?: InputMaybe<Scalars['String']>
    registrant_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    registrant_starts_with?: InputMaybe<Scalars['String']>
    registrant_starts_with_nocase?: InputMaybe<Scalars['String']>
    registration_?: InputMaybe<Registration_Filter>
    resolvedAddress?: InputMaybe<Scalars['String']>
    resolvedAddress_?: InputMaybe<Account_Filter>
    resolvedAddress_contains?: InputMaybe<Scalars['String']>
    resolvedAddress_contains_nocase?: InputMaybe<Scalars['String']>
    resolvedAddress_ends_with?: InputMaybe<Scalars['String']>
    resolvedAddress_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolvedAddress_gt?: InputMaybe<Scalars['String']>
    resolvedAddress_gte?: InputMaybe<Scalars['String']>
    resolvedAddress_in?: InputMaybe<Array<Scalars['String']>>
    resolvedAddress_lt?: InputMaybe<Scalars['String']>
    resolvedAddress_lte?: InputMaybe<Scalars['String']>
    resolvedAddress_not?: InputMaybe<Scalars['String']>
    resolvedAddress_not_contains?: InputMaybe<Scalars['String']>
    resolvedAddress_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolvedAddress_not_ends_with?: InputMaybe<Scalars['String']>
    resolvedAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolvedAddress_not_in?: InputMaybe<Array<Scalars['String']>>
    resolvedAddress_not_starts_with?: InputMaybe<Scalars['String']>
    resolvedAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolvedAddress_starts_with?: InputMaybe<Scalars['String']>
    resolvedAddress_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver?: InputMaybe<Scalars['String']>
    resolver_?: InputMaybe<Resolver_Filter>
    resolver_contains?: InputMaybe<Scalars['String']>
    resolver_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_ends_with?: InputMaybe<Scalars['String']>
    resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_gt?: InputMaybe<Scalars['String']>
    resolver_gte?: InputMaybe<Scalars['String']>
    resolver_in?: InputMaybe<Array<Scalars['String']>>
    resolver_lt?: InputMaybe<Scalars['String']>
    resolver_lte?: InputMaybe<Scalars['String']>
    resolver_not?: InputMaybe<Scalars['String']>
    resolver_not_contains?: InputMaybe<Scalars['String']>
    resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_not_ends_with?: InputMaybe<Scalars['String']>
    resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_not_in?: InputMaybe<Array<Scalars['String']>>
    resolver_not_starts_with?: InputMaybe<Scalars['String']>
    resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver_starts_with?: InputMaybe<Scalars['String']>
    resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
    subdomainCount?: InputMaybe<Scalars['Int']>
    subdomainCount_gt?: InputMaybe<Scalars['Int']>
    subdomainCount_gte?: InputMaybe<Scalars['Int']>
    subdomainCount_in?: InputMaybe<Array<Scalars['Int']>>
    subdomainCount_lt?: InputMaybe<Scalars['Int']>
    subdomainCount_lte?: InputMaybe<Scalars['Int']>
    subdomainCount_not?: InputMaybe<Scalars['Int']>
    subdomainCount_not_in?: InputMaybe<Array<Scalars['Int']>>
    subdomains_?: InputMaybe<Domain_Filter>
    ttl?: InputMaybe<Scalars['BigInt']>
    ttl_gt?: InputMaybe<Scalars['BigInt']>
    ttl_gte?: InputMaybe<Scalars['BigInt']>
    ttl_in?: InputMaybe<Array<Scalars['BigInt']>>
    ttl_lt?: InputMaybe<Scalars['BigInt']>
    ttl_lte?: InputMaybe<Scalars['BigInt']>
    ttl_not?: InputMaybe<Scalars['BigInt']>
    ttl_not_in?: InputMaybe<Array<Scalars['BigInt']>>
    wrappedDomain_?: InputMaybe<WrappedDomain_Filter>
    wrappedOwner?: InputMaybe<Scalars['String']>
    wrappedOwner_?: InputMaybe<Account_Filter>
    wrappedOwner_contains?: InputMaybe<Scalars['String']>
    wrappedOwner_contains_nocase?: InputMaybe<Scalars['String']>
    wrappedOwner_ends_with?: InputMaybe<Scalars['String']>
    wrappedOwner_ends_with_nocase?: InputMaybe<Scalars['String']>
    wrappedOwner_gt?: InputMaybe<Scalars['String']>
    wrappedOwner_gte?: InputMaybe<Scalars['String']>
    wrappedOwner_in?: InputMaybe<Array<Scalars['String']>>
    wrappedOwner_lt?: InputMaybe<Scalars['String']>
    wrappedOwner_lte?: InputMaybe<Scalars['String']>
    wrappedOwner_not?: InputMaybe<Scalars['String']>
    wrappedOwner_not_contains?: InputMaybe<Scalars['String']>
    wrappedOwner_not_contains_nocase?: InputMaybe<Scalars['String']>
    wrappedOwner_not_ends_with?: InputMaybe<Scalars['String']>
    wrappedOwner_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    wrappedOwner_not_in?: InputMaybe<Array<Scalars['String']>>
    wrappedOwner_not_starts_with?: InputMaybe<Scalars['String']>
    wrappedOwner_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    wrappedOwner_starts_with?: InputMaybe<Scalars['String']>
    wrappedOwner_starts_with_nocase?: InputMaybe<Scalars['String']>
}

export enum Domain_OrderBy {
    CreatedAt = 'createdAt',
    Events = 'events',
    ExpiryDate = 'expiryDate',
    Id = 'id',
    IsMigrated = 'isMigrated',
    LabelName = 'labelName',
    Labelhash = 'labelhash',
    Name = 'name',
    Owner = 'owner',
    OwnerId = 'owner__id',
    Parent = 'parent',
    ParentCreatedAt = 'parent__createdAt',
    ParentExpiryDate = 'parent__expiryDate',
    ParentId = 'parent__id',
    ParentIsMigrated = 'parent__isMigrated',
    ParentLabelName = 'parent__labelName',
    ParentLabelhash = 'parent__labelhash',
    ParentName = 'parent__name',
    ParentSubdomainCount = 'parent__subdomainCount',
    ParentTtl = 'parent__ttl',
    Registrant = 'registrant',
    RegistrantId = 'registrant__id',
    Registration = 'registration',
    RegistrationCost = 'registration__cost',
    RegistrationExpiryDate = 'registration__expiryDate',
    RegistrationId = 'registration__id',
    RegistrationLabelName = 'registration__labelName',
    RegistrationRegistrationDate = 'registration__registrationDate',
    ResolvedAddress = 'resolvedAddress',
    ResolvedAddressId = 'resolvedAddress__id',
    Resolver = 'resolver',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    SubdomainCount = 'subdomainCount',
    Subdomains = 'subdomains',
    Ttl = 'ttl',
    WrappedDomain = 'wrappedDomain',
    WrappedDomainExpiryDate = 'wrappedDomain__expiryDate',
    WrappedDomainFuses = 'wrappedDomain__fuses',
    WrappedDomainId = 'wrappedDomain__id',
    WrappedDomainName = 'wrappedDomain__name',
    WrappedOwner = 'wrappedOwner',
    WrappedOwnerId = 'wrappedOwner__id'
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
    tokenId: Scalars['String']
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
    tokenId: Scalars['String']
    tokenInfo: EthTokenInfo
    transfer: Transfer
}

export type Erc721Transfers = {
    __typename?: 'ERC721Transfers'
    nextKey?: Maybe<Scalars['String']>
    transfers: Array<Maybe<Erc721Transfer>>
}

export type Erc1155TokenBalance = {
    __typename?: 'ERC1155TokenBalance'
    balance: Scalars['String']
    owner: Scalars['String']
    tokenInfo: EthTokenInfo
}

export type Erc1155TokenBalances = {
    __typename?: 'ERC1155TokenBalances'
    balances: Array<Erc1155TokenBalance>
    nextKey?: Maybe<Scalars['String']>
}

export type Erc1155Transfer = {
    __typename?: 'ERC1155Transfer'
    contract: Scalars['String']
    stateDiff?: Maybe<StateDiffChange>
    tokenId: Scalars['String']
    tokenInfo: EthTokenInfo
    transfer: Transfer
    value: Scalars['String']
}

export type Erc1155Transfers = {
    __typename?: 'ERC1155Transfers'
    nextKey?: Maybe<Scalars['String']>
    transfers: Array<Maybe<Erc1155Transfer>>
}

export type EthTransactionTransfer = {
    __typename?: 'ETHTransactionTransfer'
    stateDiff?: Maybe<StateDiffChange>
    transactionStateDiff: TransactionStateDiffChange
    transfer: Transfer
    value: Scalars['String']
}

export type EthTransactionTransfers = {
    __typename?: 'ETHTransactionTransfers'
    nextKey?: Maybe<Scalars['String']>
    transfers: Array<EthTransactionTransfer>
}

export type EthTransfers = {
    __typename?: 'ETHTransfers'
    nextKey?: Maybe<Scalars['String']>
    transfers: Array<Maybe<EthTransfer>>
}

export type EthWithdrawalTransfer = {
    __typename?: 'ETHWithdrawalTransfer'
    stateDiff?: Maybe<StateDiffChange>
    transfer: Transfer
    validatorIndex: Scalars['String']
    value: Scalars['String']
    withdrawalIndex: Scalars['String']
}

export type EthWithdrawalTransfers = {
    __typename?: 'ETHWithdrawalTransfers'
    nextKey?: Maybe<Scalars['String']>
    transfers: Array<EthWithdrawalTransfer>
}

export type EthAndErc20TokenBalances = {
    __typename?: 'EthAndErc20TokenBalances'
    balances: Array<EthOrErc20TokenBalance>
}

export type EthOrErc20TokenBalance = {
    __typename?: 'EthOrErc20TokenBalance'
    balance: Scalars['String']
    owner: Scalars['String']
    timestampUnixSec: Scalars['Int']
    tokenInfo?: Maybe<EthTokenInfo>
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
    description?: Maybe<Scalars['String']>
    iconPng?: Maybe<Scalars['String']>
    name?: Maybe<Scalars['String']>
    symbol?: Maybe<Scalars['String']>
    tokenId?: Maybe<Scalars['String']>
    totalSupply?: Maybe<Scalars['String']>
    type?: Maybe<TokenType>
    website?: Maybe<Scalars['String']>
}

export type EthTransfer = {
    __typename?: 'EthTransfer'
    stateDiff?: Maybe<StateDiffChange>
    transfer: Transfer
    value: Scalars['String']
}

export type ExpiryExtended = DomainEvent & {
    __typename?: 'ExpiryExtended'
    /** The block number at which the event occurred */
    blockNumber: Scalars['Int']
    /** The domain name associated with the event */
    domain: Domain
    /** The new expiry date associated with the domain after the extension event */
    expiryDate: Scalars['BigInt']
    /** The unique identifier of the event */
    id: Scalars['ID']
    /** The transaction hash of the transaction that triggered the event */
    transactionID: Scalars['Bytes']
}

export type ExpiryExtended_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<ExpiryExtended_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    domain?: InputMaybe<Scalars['String']>
    domain_?: InputMaybe<Domain_Filter>
    domain_contains?: InputMaybe<Scalars['String']>
    domain_contains_nocase?: InputMaybe<Scalars['String']>
    domain_ends_with?: InputMaybe<Scalars['String']>
    domain_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_gt?: InputMaybe<Scalars['String']>
    domain_gte?: InputMaybe<Scalars['String']>
    domain_in?: InputMaybe<Array<Scalars['String']>>
    domain_lt?: InputMaybe<Scalars['String']>
    domain_lte?: InputMaybe<Scalars['String']>
    domain_not?: InputMaybe<Scalars['String']>
    domain_not_contains?: InputMaybe<Scalars['String']>
    domain_not_contains_nocase?: InputMaybe<Scalars['String']>
    domain_not_ends_with?: InputMaybe<Scalars['String']>
    domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_not_in?: InputMaybe<Array<Scalars['String']>>
    domain_not_starts_with?: InputMaybe<Scalars['String']>
    domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    domain_starts_with?: InputMaybe<Scalars['String']>
    domain_starts_with_nocase?: InputMaybe<Scalars['String']>
    expiryDate?: InputMaybe<Scalars['BigInt']>
    expiryDate_gt?: InputMaybe<Scalars['BigInt']>
    expiryDate_gte?: InputMaybe<Scalars['BigInt']>
    expiryDate_in?: InputMaybe<Array<Scalars['BigInt']>>
    expiryDate_lt?: InputMaybe<Scalars['BigInt']>
    expiryDate_lte?: InputMaybe<Scalars['BigInt']>
    expiryDate_not?: InputMaybe<Scalars['BigInt']>
    expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<ExpiryExtended_Filter>>>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum ExpiryExtended_OrderBy {
    BlockNumber = 'blockNumber',
    Domain = 'domain',
    DomainCreatedAt = 'domain__createdAt',
    DomainExpiryDate = 'domain__expiryDate',
    DomainId = 'domain__id',
    DomainIsMigrated = 'domain__isMigrated',
    DomainLabelName = 'domain__labelName',
    DomainLabelhash = 'domain__labelhash',
    DomainName = 'domain__name',
    DomainSubdomainCount = 'domain__subdomainCount',
    DomainTtl = 'domain__ttl',
    ExpiryDate = 'expiryDate',
    Id = 'id',
    TransactionId = 'transactionID'
}

export type FusesSet = DomainEvent & {
    __typename?: 'FusesSet'
    /** The block number at which the event occurred */
    blockNumber: Scalars['Int']
    /** The domain name associated with the event */
    domain: Domain
    /** The number of fuses associated with the domain after the set event */
    fuses: Scalars['Int']
    /** The unique identifier of the event */
    id: Scalars['ID']
    /** The transaction hash of the transaction that triggered the event */
    transactionID: Scalars['Bytes']
}

export type FusesSet_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<FusesSet_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    domain?: InputMaybe<Scalars['String']>
    domain_?: InputMaybe<Domain_Filter>
    domain_contains?: InputMaybe<Scalars['String']>
    domain_contains_nocase?: InputMaybe<Scalars['String']>
    domain_ends_with?: InputMaybe<Scalars['String']>
    domain_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_gt?: InputMaybe<Scalars['String']>
    domain_gte?: InputMaybe<Scalars['String']>
    domain_in?: InputMaybe<Array<Scalars['String']>>
    domain_lt?: InputMaybe<Scalars['String']>
    domain_lte?: InputMaybe<Scalars['String']>
    domain_not?: InputMaybe<Scalars['String']>
    domain_not_contains?: InputMaybe<Scalars['String']>
    domain_not_contains_nocase?: InputMaybe<Scalars['String']>
    domain_not_ends_with?: InputMaybe<Scalars['String']>
    domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_not_in?: InputMaybe<Array<Scalars['String']>>
    domain_not_starts_with?: InputMaybe<Scalars['String']>
    domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    domain_starts_with?: InputMaybe<Scalars['String']>
    domain_starts_with_nocase?: InputMaybe<Scalars['String']>
    fuses?: InputMaybe<Scalars['Int']>
    fuses_gt?: InputMaybe<Scalars['Int']>
    fuses_gte?: InputMaybe<Scalars['Int']>
    fuses_in?: InputMaybe<Array<Scalars['Int']>>
    fuses_lt?: InputMaybe<Scalars['Int']>
    fuses_lte?: InputMaybe<Scalars['Int']>
    fuses_not?: InputMaybe<Scalars['Int']>
    fuses_not_in?: InputMaybe<Array<Scalars['Int']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<FusesSet_Filter>>>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum FusesSet_OrderBy {
    BlockNumber = 'blockNumber',
    Domain = 'domain',
    DomainCreatedAt = 'domain__createdAt',
    DomainExpiryDate = 'domain__expiryDate',
    DomainId = 'domain__id',
    DomainIsMigrated = 'domain__isMigrated',
    DomainLabelName = 'domain__labelName',
    DomainLabelhash = 'domain__labelhash',
    DomainName = 'domain__name',
    DomainSubdomainCount = 'domain__subdomainCount',
    DomainTtl = 'domain__ttl',
    Fuses = 'fuses',
    Id = 'id',
    TransactionId = 'transactionID'
}

export type GetTokenMarketMoversResult = {
    __typename?: 'GetTokenMarketMoversResult'
    items: Array<TokenMarketMoversItem>
}

export enum HashType {
    AddressHash = 'ADDRESS_HASH',
    BlockHash = 'BLOCK_HASH',
    CodeHash = 'CODE_HASH',
    TokenHash = 'TOKEN_HASH',
    TxHash = 'TX_HASH',
    UncleHash = 'UNCLE_HASH'
}

export type InterfaceChanged = ResolverEvent & {
    __typename?: 'InterfaceChanged'
    /** The block number in which the event occurred */
    blockNumber: Scalars['Int']
    /** Concatenation of block number and log ID */
    id: Scalars['ID']
    /** The address of the contract that implements the interface */
    implementer: Scalars['Bytes']
    /** The ID of the EIP-1820 interface that was changed */
    interfaceID: Scalars['Bytes']
    /** Used to derive relationships to Resolvers */
    resolver: Resolver
    /** The transaction ID for the transaction in which the event occurred */
    transactionID: Scalars['Bytes']
}

export type InterfaceChanged_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<InterfaceChanged_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    implementer?: InputMaybe<Scalars['Bytes']>
    implementer_contains?: InputMaybe<Scalars['Bytes']>
    implementer_gt?: InputMaybe<Scalars['Bytes']>
    implementer_gte?: InputMaybe<Scalars['Bytes']>
    implementer_in?: InputMaybe<Array<Scalars['Bytes']>>
    implementer_lt?: InputMaybe<Scalars['Bytes']>
    implementer_lte?: InputMaybe<Scalars['Bytes']>
    implementer_not?: InputMaybe<Scalars['Bytes']>
    implementer_not_contains?: InputMaybe<Scalars['Bytes']>
    implementer_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    interfaceID?: InputMaybe<Scalars['Bytes']>
    interfaceID_contains?: InputMaybe<Scalars['Bytes']>
    interfaceID_gt?: InputMaybe<Scalars['Bytes']>
    interfaceID_gte?: InputMaybe<Scalars['Bytes']>
    interfaceID_in?: InputMaybe<Array<Scalars['Bytes']>>
    interfaceID_lt?: InputMaybe<Scalars['Bytes']>
    interfaceID_lte?: InputMaybe<Scalars['Bytes']>
    interfaceID_not?: InputMaybe<Scalars['Bytes']>
    interfaceID_not_contains?: InputMaybe<Scalars['Bytes']>
    interfaceID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    or?: InputMaybe<Array<InputMaybe<InterfaceChanged_Filter>>>
    resolver?: InputMaybe<Scalars['String']>
    resolver_?: InputMaybe<Resolver_Filter>
    resolver_contains?: InputMaybe<Scalars['String']>
    resolver_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_ends_with?: InputMaybe<Scalars['String']>
    resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_gt?: InputMaybe<Scalars['String']>
    resolver_gte?: InputMaybe<Scalars['String']>
    resolver_in?: InputMaybe<Array<Scalars['String']>>
    resolver_lt?: InputMaybe<Scalars['String']>
    resolver_lte?: InputMaybe<Scalars['String']>
    resolver_not?: InputMaybe<Scalars['String']>
    resolver_not_contains?: InputMaybe<Scalars['String']>
    resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_not_ends_with?: InputMaybe<Scalars['String']>
    resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_not_in?: InputMaybe<Array<Scalars['String']>>
    resolver_not_starts_with?: InputMaybe<Scalars['String']>
    resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver_starts_with?: InputMaybe<Scalars['String']>
    resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum InterfaceChanged_OrderBy {
    BlockNumber = 'blockNumber',
    Id = 'id',
    Implementer = 'implementer',
    InterfaceId = 'interfaceID',
    Resolver = 'resolver',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    TransactionId = 'transactionID'
}

export type LatestBlockData = {
    __typename?: 'LatestBlockData'
    avgBlockTime: Scalars['Int']
    avgGasBurnt?: Maybe<Scalars['String']>
    avgGasPrice: Scalars['String']
    baseFeePerGas?: Maybe<Scalars['String']>
    difficulty: Scalars['String']
    hashRate: Scalars['String']
    number: Scalars['Int']
    timestamp: Scalars['Int']
}

export type Log = {
    __typename?: 'Log'
    /** this value will be eventually switched to to the "signature" property */
    _signature_tmp_?: Maybe<Scalars['String']>
    address: Scalars['String']
    data: Scalars['String']
    logIndex: Scalars['Int']
    preimage?: Maybe<Scalars['String']>
    removed: Scalars['Boolean']
    /**
     * TODO: the value of this field will be renamed to "preimage"
     *
     * Best guess at the signature of the event that caused this log
     * The preimage of the first element of the "topics" array, if exists
     * Can be used to decode the logs data
     * Null if the signature was not able to be determined
     *
     * For example:
     *     - Transfer(address,address,uint256)
     *     - Approval(address,address,uint256)
     *     - TransferSingle(address,address,address,uint256,uint256)
     *     - TransferBatch(address,address,address,uint256[],uint256[])
     *     - URI(string,uint256)
     *     - Mint(address,uint256,uint256)
     *     - ...
     */
    signature?: Maybe<Scalars['String']>
    topics: Array<Scalars['String']>
    type?: Maybe<Scalars['String']>
}

export enum MmChain {
    Bsc = 'BSC',
    Eth = 'ETH',
    Matic = 'MATIC'
}

export type MmEthOrErc20Balance = {
    __typename?: 'MmETHOrERC20Balance'
    /** 0x prefixed ethereum address that owners the token */
    ownerAddress: Scalars['EthVMPrefixedEthereumAddress']
    /** 0x prefixed base16 balance that the owner has of the token */
    ownerBalance: Scalars['EthVMPrefixedBase16String']
    ownerBalanceUpdatedAtIso8601: Scalars['EthVMIso8601DateTimeMilliseconds']
    ownerBalanceUpdatedAtUnixSec: Scalars['EthVMUnixEpochSeconds']
    /** 0x prefixed ethereum address of the token contract */
    tokenContractAddress: Scalars['EthVMPrefixedEthereumAddress']
    tokenDecimals?: Maybe<Scalars['Int']>
    tokenIconPngUrl?: Maybe<Scalars['EthVMUrl']>
    tokenIconUrl?: Maybe<Scalars['EthVMUrl']>
    tokenMarketCap?: Maybe<Scalars['EthVMCurrencyFloat']>
    tokenName?: Maybe<Scalars['String']>
    tokenPrice?: Maybe<Scalars['EthVMCurrencyFloat']>
    tokenPriceChangePercentage1h?: Maybe<Scalars['EthVMCurrencyFloat']>
    tokenPriceChangePercentage1y?: Maybe<Scalars['EthVMCurrencyFloat']>
    tokenPriceChangePercentage5m?: Maybe<Scalars['EthVMCurrencyFloat']>
    tokenPriceChangePercentage7d?: Maybe<Scalars['EthVMCurrencyFloat']>
    tokenPriceChangePercentage14d?: Maybe<Scalars['EthVMCurrencyFloat']>
    tokenPriceChangePercentage24h?: Maybe<Scalars['EthVMCurrencyFloat']>
    tokenPriceChangePercentage30d?: Maybe<Scalars['EthVMCurrencyFloat']>
    tokenPriceChangePercentage200d?: Maybe<Scalars['EthVMCurrencyFloat']>
    tokenPriceUpdatedAtIso8601?: Maybe<Scalars['EthVMIso8601DateTimeMilliseconds']>
    tokenPriceUpdatedAtUnixSec?: Maybe<Scalars['EthVMUnixEpochSeconds']>
    tokenSparkline24h?: Maybe<Array<Scalars['EthVMCurrencyFloat']>>
    tokenSymbol?: Maybe<Scalars['String']>
    tokenVolume24h?: Maybe<Scalars['EthVMCurrencyFloat']>
    tokenWebsiteUrl?: Maybe<Scalars['EthVMUrl']>
}

export type MmGetErc20BalanceDeltasByBlockNumberResult = {
    __typename?: 'MmGetERC20BalanceDeltasByBlockNumberResult'
    items: Array<MmGetErc20BalanceDeltasByBlockNumberResultItem>
    nextKey?: Maybe<Scalars['String']>
}

export type MmGetErc20BalanceDeltasByBlockNumberResultItem = {
    __typename?: 'MmGetERC20BalanceDeltasByBlockNumberResultItem'
    /** balance of the owner with the contract after the block (no decimals) */
    balanceNext: Scalars['EthVMUintHex']
    /** balance of the owner with the contract before the block (no decimals) */
    balancePrev: Scalars['EthVMUintHex']
    blockNumber: Scalars['Int']
    contractAddress: Scalars['EthVMPrefixedEthereumAddress']
    ownerAddress: Scalars['EthVMPrefixedEthereumAddress']
    timestampIso8601: Scalars['EthVMIso8601DateTimeMilliseconds']
    timestampUnixSec: Scalars['EthVMUnixEpochSeconds']
}

export type MmGetEthAndErc20BalancesWithPricesByOwnerAddressResult = {
    __typename?: 'MmGetEthAndERC20BalancesWithPricesByOwnerAddressResult'
    items: Array<MmEthOrErc20Balance>
    nextKey?: Maybe<Scalars['String']>
}

export type MmGetEthBalanceDeltasByBlockNumberResult = {
    __typename?: 'MmGetEthBalanceDeltasByBlockNumberResult'
    items: Array<MmGetEthBalanceDeltasByBlockNumberResultItem>
    nextKey?: Maybe<Scalars['String']>
}

export type MmGetEthBalanceDeltasByBlockNumberResultItem = {
    __typename?: 'MmGetEthBalanceDeltasByBlockNumberResultItem'
    /** ETH Balance after the block (wei) */
    balanceNext: Scalars['EthVMUintHex']
    /** ETH Balance before the block (wei) */
    balancePrev: Scalars['EthVMUintHex']
    blockNumber: Scalars['Int']
    ownerAddress: Scalars['EthVMPrefixedEthereumAddress']
    timestampIso8601: Scalars['EthVMIso8601DateTimeMilliseconds']
    timestampUnixSec: Scalars['EthVMUnixEpochSeconds']
}

export type MmGetTokenMarketDataByChainAndContractAddressesResult = {
    __typename?: 'MmGetTokenMarketDataByChainAndContractAddressesResult'
    items: Array<Maybe<MmTokenMarketData>>
}

export type MmGetTokenMarketDataByChainResult = {
    __typename?: 'MmGetTokenMarketDataByChainResult'
    items: Array<MmTokenMarketData>
    nextKey?: Maybe<Scalars['String']>
}

export type MmGetTokenMarketMoversByChainResult = {
    __typename?: 'MmGetTokenMarketMoversByChainResult'
    items: Array<MmTokenMarketMover>
}

export enum MmGetTransfersByBlockNumberItemType {
    Erc20 = 'ERC20',
    Erc721 = 'ERC721',
    Erc1155 = 'ERC1155',
    Eth = 'ETH'
}

export type MmGetTransfersByBlockNumberResult = {
    __typename?: 'MmGetTransfersByBlockNumberResult'
    /** This page of transfers */
    items: Array<MmGetTransfersByBlockNumberResultItem>
    /**
     * Token used to retreieve the next page of transfers
     * Undefined if this is the last page
     */
    nextKey?: Maybe<Scalars['String']>
}

export type MmGetTransfersByBlockNumberResultItem = {
    __typename?: 'MmGetTransfersByBlockNumberResultItem'
    /** Number of the block containing the transfer */
    blockNumber: Scalars['Int']
    /**
     * Address of the contract, if applicable
     * Only applicable to Type = ERC20, ERC721 or ERC1155
     */
    contractAddress?: Maybe<Scalars['EthVMPrefixedEthereumAddress']>
    /** Address sending the transfer */
    fromAddress?: Maybe<Scalars['EthVMPrefixedEthereumAddress']>
    /**
     * Did the transfer succeed or fail?
     * true=success
     * false=fail
     */
    status: Scalars['Boolean']
    /** Timestamp of the block containing the transfer in Iso8601 milliseconds */
    timestampIso8601: Scalars['EthVMIso8601DateTimeMilliseconds']
    /** Timestamp of the block containing the transfer in unix epoch seconds */
    timestampUnixSec: Scalars['EthVMUnixEpochSeconds']
    /** Address receiving the transfer */
    toAddress?: Maybe<Scalars['EthVMPrefixedEthereumAddress']>
    /**
     * Unique id (withn the contract) of NFT token being transferred, if applicable
     * Only applicable to Type = ERC721 or ERC1155
     */
    tokenId?: Maybe<Scalars['EthVMUintHex']>
    /**
     * Transaction hash that the transfer belongs to, if applicable
     * Not all transfers are associated with a transaction, for example block
     * rewards or withdrawals
     */
    transactionHash?: Maybe<Scalars['EthVMTransactionHash']>
    /** Type of the MmGetTransfersByBlockNumberResult item */
    type: MmGetTransfersByBlockNumberItemType
    /**
     * Amount of the token transferred from fromAddress to toAddress, if applicable
     * Only applicable to Type = ETH, ERC20 or ERC1155
     */
    value?: Maybe<Scalars['EthVMUintHex']>
}

export type MmSearchTokenByChainResult = {
    __typename?: 'MmSearchTokenByChainResult'
    items: Array<MmTokenSearchResult>
}

export enum MmSortDirection {
    Asc = 'Asc',
    Desc = 'Desc'
}

export type MmTokenMarketData = {
    __typename?: 'MmTokenMarketData'
    circulatingSupply?: Maybe<Scalars['EthVMCurrencyFloat']>
    coingeckoCoinId: Scalars['String']
    contractAddress?: Maybe<Scalars['EthVMPrefixedEthereumAddress']>
    decimals?: Maybe<Scalars['Int']>
    iconPngUrl?: Maybe<Scalars['EthVMUrl']>
    iconUrl?: Maybe<Scalars['EthVMUrl']>
    marketCap?: Maybe<Scalars['EthVMCurrencyFloat']>
    name: Scalars['String']
    price?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage1h?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage1y?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage5m?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage7d?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage14d?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage24h?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage30d?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage200d?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceLastUpdatedAtIso8601?: Maybe<Scalars['EthVMIso8601DateTimeMilliseconds']>
    priceLastUpdatedAtUnixSec?: Maybe<Scalars['EthVMUnixEpochSeconds']>
    sparkline24h: Array<Scalars['EthVMCurrencyFloat']>
    symbol: Scalars['String']
    totalSupply?: Maybe<Scalars['EthVMCurrencyFloat']>
    volume24h?: Maybe<Scalars['EthVMCurrencyFloat']>
    websiteUrl?: Maybe<Scalars['EthVMUrl']>
}

export enum MmTokenMarketDataByChainSortOption {
    MarketCap = 'MarketCap',
    Price = 'Price',
    PriceChangePercentage1H = 'PriceChangePercentage1H',
    PriceChangePercentage1Y = 'PriceChangePercentage1Y',
    PriceChangePercentage5M = 'PriceChangePercentage5M',
    PriceChangePercentage7D = 'PriceChangePercentage7D',
    PriceChangePercentage14D = 'PriceChangePercentage14D',
    PriceChangePercentage24H = 'PriceChangePercentage24H',
    PriceChangePercentage30D = 'PriceChangePercentage30D',
    PriceChangePercentage200D = 'PriceChangePercentage200D',
    Volume24h = 'Volume24h'
}

export type MmTokenMarketMover = {
    __typename?: 'MmTokenMarketMover'
    ath?: Maybe<Scalars['Float']>
    contractAddress?: Maybe<Scalars['EthVMPrefixedEthereumAddress']>
    decimals?: Maybe<Scalars['Int']>
    eventTimestampIso8601: Scalars['EthVMIso8601DateTimeMilliseconds']
    eventTimestampUnixSec: Scalars['EthVMUnixEpochSeconds']
    icon?: Maybe<Scalars['EthVMUrl']>
    iconPng?: Maybe<Scalars['EthVMUrl']>
    marketDataLastUpdatedAtIso8601: Scalars['EthVMIso8601DateTimeMilliseconds']
    marketDataLastUpdatedAtUnixSec: Scalars['EthVMUnixEpochSeconds']
    name: Scalars['String']
    price?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage?: Maybe<Scalars['Float']>
    symbol: Scalars['String']
    type: MmTokenMarketMoverType
    typeSeconds: Scalars['Int']
    website?: Maybe<Scalars['EthVMUrl']>
}

export enum MmTokenMarketMoverType {
    Ath = 'ATH',
    '1H' = '_1H',
    '5M' = '_5M',
    '7D' = '_7D',
    '24H' = '_24H',
    '30D' = '_30D'
}

export type MmTokenSearchResult = {
    __typename?: 'MmTokenSearchResult'
    contractAddress: Scalars['EthVMPrefixedEthereumAddress']
    decimals?: Maybe<Scalars['Int']>
    iconPngUrl?: Maybe<Scalars['EthVMUrl']>
    iconUrl?: Maybe<Scalars['EthVMUrl']>
    marketCap?: Maybe<Scalars['EthVMCurrencyFloat']>
    name: Scalars['String']
    price?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage1h?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage1y?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage5m?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage7d?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage14d?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage24h?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage30d?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage200d?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceLastUpdatedAtIso8601: Scalars['EthVMIso8601DateTimeMilliseconds']
    priceLastUpdatedAtUnixSec: Scalars['EthVMUnixEpochSeconds']
    sparkline24h: Array<Scalars['EthVMCurrencyFloat']>
    symbol: Scalars['String']
    volume24h?: Maybe<Scalars['EthVMCurrencyFloat']>
    websiteUrl?: Maybe<Scalars['EthVMUrl']>
}

export type MulticoinAddrChanged = ResolverEvent & {
    __typename?: 'MulticoinAddrChanged'
    /** The new address value for the given coin type */
    addr: Scalars['Bytes']
    /** Block number in which this event was emitted */
    blockNumber: Scalars['Int']
    /** The coin type of the changed address */
    coinType: Scalars['BigInt']
    /** Unique identifier for the event */
    id: Scalars['ID']
    /** Resolver associated with this event */
    resolver: Resolver
    /** Transaction ID in which this event was emitted */
    transactionID: Scalars['Bytes']
}

export type MulticoinAddrChanged_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    addr?: InputMaybe<Scalars['Bytes']>
    addr_contains?: InputMaybe<Scalars['Bytes']>
    addr_gt?: InputMaybe<Scalars['Bytes']>
    addr_gte?: InputMaybe<Scalars['Bytes']>
    addr_in?: InputMaybe<Array<Scalars['Bytes']>>
    addr_lt?: InputMaybe<Scalars['Bytes']>
    addr_lte?: InputMaybe<Scalars['Bytes']>
    addr_not?: InputMaybe<Scalars['Bytes']>
    addr_not_contains?: InputMaybe<Scalars['Bytes']>
    addr_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    and?: InputMaybe<Array<InputMaybe<MulticoinAddrChanged_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    coinType?: InputMaybe<Scalars['BigInt']>
    coinType_gt?: InputMaybe<Scalars['BigInt']>
    coinType_gte?: InputMaybe<Scalars['BigInt']>
    coinType_in?: InputMaybe<Array<Scalars['BigInt']>>
    coinType_lt?: InputMaybe<Scalars['BigInt']>
    coinType_lte?: InputMaybe<Scalars['BigInt']>
    coinType_not?: InputMaybe<Scalars['BigInt']>
    coinType_not_in?: InputMaybe<Array<Scalars['BigInt']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<MulticoinAddrChanged_Filter>>>
    resolver?: InputMaybe<Scalars['String']>
    resolver_?: InputMaybe<Resolver_Filter>
    resolver_contains?: InputMaybe<Scalars['String']>
    resolver_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_ends_with?: InputMaybe<Scalars['String']>
    resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_gt?: InputMaybe<Scalars['String']>
    resolver_gte?: InputMaybe<Scalars['String']>
    resolver_in?: InputMaybe<Array<Scalars['String']>>
    resolver_lt?: InputMaybe<Scalars['String']>
    resolver_lte?: InputMaybe<Scalars['String']>
    resolver_not?: InputMaybe<Scalars['String']>
    resolver_not_contains?: InputMaybe<Scalars['String']>
    resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_not_ends_with?: InputMaybe<Scalars['String']>
    resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_not_in?: InputMaybe<Array<Scalars['String']>>
    resolver_not_starts_with?: InputMaybe<Scalars['String']>
    resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver_starts_with?: InputMaybe<Scalars['String']>
    resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum MulticoinAddrChanged_OrderBy {
    Addr = 'addr',
    BlockNumber = 'blockNumber',
    CoinType = 'coinType',
    Id = 'id',
    Resolver = 'resolver',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    TransactionId = 'transactionID'
}

export type Mutation = {
    __typename?: 'Mutation'
    submitUnsignedPendingTransaction: Scalars['Int']
    verifyContract: ContractVerify
}

export type MutationSubmitUnsignedPendingTransactionArgs = {
    accessList?: InputMaybe<Array<TransactionAccessListItem>>
    chainId: Scalars['String']
    from: Scalars['String']
    gas: Scalars['String']
    gasPrice?: InputMaybe<Scalars['String']>
    hash: Scalars['String']
    input: Scalars['String']
    maxFeePerGas?: InputMaybe<Scalars['String']>
    maxPriorityFeePerGas?: InputMaybe<Scalars['String']>
    nonce: Scalars['Int']
    to?: InputMaybe<Scalars['String']>
    type: Scalars['String']
    value: Scalars['String']
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

export type NftToken = {
    __typename?: 'NFTToken'
    balance: Scalars['String']
    owner: Scalars['String']
    tokenInfo: EthTokenInfo
    type: NftType
}

export type NftTokenBalance = {
    __typename?: 'NFTTokenBalance'
    balance: Scalars['String']
    owner: Scalars['String']
}

export type NftTokens = {
    __typename?: 'NFTTokens'
    nextKey?: Maybe<Scalars['String']>
    tokens: Array<NftToken>
}

export type NftTransfer = {
    __typename?: 'NFTTransfer'
    contract: Scalars['String']
    stateDiff?: Maybe<StateDiffChange>
    tokenId: Scalars['String']
    tokenInfo: EthTokenInfo
    transfer: Transfer
    value?: Maybe<Scalars['String']>
}

export type NftTransfers = {
    __typename?: 'NFTTransfers'
    nextKey?: Maybe<Scalars['String']>
    transfers: Array<Maybe<NftTransfer>>
}

export enum NftType {
    Erc721 = 'ERC721',
    Erc1155 = 'ERC1155'
}

export type NameChanged = ResolverEvent & {
    __typename?: 'NameChanged'
    /** Block number where event occurred */
    blockNumber: Scalars['Int']
    /** Concatenation of block number and log ID */
    id: Scalars['ID']
    /** New ENS name value */
    name: Scalars['String']
    /** Used to derive relationships to Resolvers */
    resolver: Resolver
    /** Unique transaction ID where event occurred */
    transactionID: Scalars['Bytes']
}

export type NameChanged_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<NameChanged_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    name?: InputMaybe<Scalars['String']>
    name_contains?: InputMaybe<Scalars['String']>
    name_contains_nocase?: InputMaybe<Scalars['String']>
    name_ends_with?: InputMaybe<Scalars['String']>
    name_ends_with_nocase?: InputMaybe<Scalars['String']>
    name_gt?: InputMaybe<Scalars['String']>
    name_gte?: InputMaybe<Scalars['String']>
    name_in?: InputMaybe<Array<Scalars['String']>>
    name_lt?: InputMaybe<Scalars['String']>
    name_lte?: InputMaybe<Scalars['String']>
    name_not?: InputMaybe<Scalars['String']>
    name_not_contains?: InputMaybe<Scalars['String']>
    name_not_contains_nocase?: InputMaybe<Scalars['String']>
    name_not_ends_with?: InputMaybe<Scalars['String']>
    name_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    name_not_in?: InputMaybe<Array<Scalars['String']>>
    name_not_starts_with?: InputMaybe<Scalars['String']>
    name_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    name_starts_with?: InputMaybe<Scalars['String']>
    name_starts_with_nocase?: InputMaybe<Scalars['String']>
    or?: InputMaybe<Array<InputMaybe<NameChanged_Filter>>>
    resolver?: InputMaybe<Scalars['String']>
    resolver_?: InputMaybe<Resolver_Filter>
    resolver_contains?: InputMaybe<Scalars['String']>
    resolver_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_ends_with?: InputMaybe<Scalars['String']>
    resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_gt?: InputMaybe<Scalars['String']>
    resolver_gte?: InputMaybe<Scalars['String']>
    resolver_in?: InputMaybe<Array<Scalars['String']>>
    resolver_lt?: InputMaybe<Scalars['String']>
    resolver_lte?: InputMaybe<Scalars['String']>
    resolver_not?: InputMaybe<Scalars['String']>
    resolver_not_contains?: InputMaybe<Scalars['String']>
    resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_not_ends_with?: InputMaybe<Scalars['String']>
    resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_not_in?: InputMaybe<Array<Scalars['String']>>
    resolver_not_starts_with?: InputMaybe<Scalars['String']>
    resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver_starts_with?: InputMaybe<Scalars['String']>
    resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum NameChanged_OrderBy {
    BlockNumber = 'blockNumber',
    Id = 'id',
    Name = 'name',
    Resolver = 'resolver',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    TransactionId = 'transactionID'
}

export type NameRegistered = RegistrationEvent & {
    __typename?: 'NameRegistered'
    /** The block number of the event */
    blockNumber: Scalars['Int']
    /** The expiry date of the registration */
    expiryDate: Scalars['BigInt']
    /** The unique identifier of the NameRegistered event */
    id: Scalars['ID']
    /** The account that registered the name */
    registrant: Account
    /** The registration associated with the event */
    registration: Registration
    /** The transaction ID associated with the event */
    transactionID: Scalars['Bytes']
}

export type NameRegistered_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<NameRegistered_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    expiryDate?: InputMaybe<Scalars['BigInt']>
    expiryDate_gt?: InputMaybe<Scalars['BigInt']>
    expiryDate_gte?: InputMaybe<Scalars['BigInt']>
    expiryDate_in?: InputMaybe<Array<Scalars['BigInt']>>
    expiryDate_lt?: InputMaybe<Scalars['BigInt']>
    expiryDate_lte?: InputMaybe<Scalars['BigInt']>
    expiryDate_not?: InputMaybe<Scalars['BigInt']>
    expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<NameRegistered_Filter>>>
    registrant?: InputMaybe<Scalars['String']>
    registrant_?: InputMaybe<Account_Filter>
    registrant_contains?: InputMaybe<Scalars['String']>
    registrant_contains_nocase?: InputMaybe<Scalars['String']>
    registrant_ends_with?: InputMaybe<Scalars['String']>
    registrant_ends_with_nocase?: InputMaybe<Scalars['String']>
    registrant_gt?: InputMaybe<Scalars['String']>
    registrant_gte?: InputMaybe<Scalars['String']>
    registrant_in?: InputMaybe<Array<Scalars['String']>>
    registrant_lt?: InputMaybe<Scalars['String']>
    registrant_lte?: InputMaybe<Scalars['String']>
    registrant_not?: InputMaybe<Scalars['String']>
    registrant_not_contains?: InputMaybe<Scalars['String']>
    registrant_not_contains_nocase?: InputMaybe<Scalars['String']>
    registrant_not_ends_with?: InputMaybe<Scalars['String']>
    registrant_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    registrant_not_in?: InputMaybe<Array<Scalars['String']>>
    registrant_not_starts_with?: InputMaybe<Scalars['String']>
    registrant_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    registrant_starts_with?: InputMaybe<Scalars['String']>
    registrant_starts_with_nocase?: InputMaybe<Scalars['String']>
    registration?: InputMaybe<Scalars['String']>
    registration_?: InputMaybe<Registration_Filter>
    registration_contains?: InputMaybe<Scalars['String']>
    registration_contains_nocase?: InputMaybe<Scalars['String']>
    registration_ends_with?: InputMaybe<Scalars['String']>
    registration_ends_with_nocase?: InputMaybe<Scalars['String']>
    registration_gt?: InputMaybe<Scalars['String']>
    registration_gte?: InputMaybe<Scalars['String']>
    registration_in?: InputMaybe<Array<Scalars['String']>>
    registration_lt?: InputMaybe<Scalars['String']>
    registration_lte?: InputMaybe<Scalars['String']>
    registration_not?: InputMaybe<Scalars['String']>
    registration_not_contains?: InputMaybe<Scalars['String']>
    registration_not_contains_nocase?: InputMaybe<Scalars['String']>
    registration_not_ends_with?: InputMaybe<Scalars['String']>
    registration_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    registration_not_in?: InputMaybe<Array<Scalars['String']>>
    registration_not_starts_with?: InputMaybe<Scalars['String']>
    registration_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    registration_starts_with?: InputMaybe<Scalars['String']>
    registration_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum NameRegistered_OrderBy {
    BlockNumber = 'blockNumber',
    ExpiryDate = 'expiryDate',
    Id = 'id',
    Registrant = 'registrant',
    RegistrantId = 'registrant__id',
    Registration = 'registration',
    RegistrationCost = 'registration__cost',
    RegistrationExpiryDate = 'registration__expiryDate',
    RegistrationId = 'registration__id',
    RegistrationLabelName = 'registration__labelName',
    RegistrationRegistrationDate = 'registration__registrationDate',
    TransactionId = 'transactionID'
}

export type NameRenewed = RegistrationEvent & {
    __typename?: 'NameRenewed'
    /** The block number of the event */
    blockNumber: Scalars['Int']
    /** The new expiry date of the registration */
    expiryDate: Scalars['BigInt']
    /** The unique identifier of the NameRenewed event */
    id: Scalars['ID']
    /** The registration associated with the event */
    registration: Registration
    /** The transaction ID associated with the event */
    transactionID: Scalars['Bytes']
}

export type NameRenewed_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<NameRenewed_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    expiryDate?: InputMaybe<Scalars['BigInt']>
    expiryDate_gt?: InputMaybe<Scalars['BigInt']>
    expiryDate_gte?: InputMaybe<Scalars['BigInt']>
    expiryDate_in?: InputMaybe<Array<Scalars['BigInt']>>
    expiryDate_lt?: InputMaybe<Scalars['BigInt']>
    expiryDate_lte?: InputMaybe<Scalars['BigInt']>
    expiryDate_not?: InputMaybe<Scalars['BigInt']>
    expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<NameRenewed_Filter>>>
    registration?: InputMaybe<Scalars['String']>
    registration_?: InputMaybe<Registration_Filter>
    registration_contains?: InputMaybe<Scalars['String']>
    registration_contains_nocase?: InputMaybe<Scalars['String']>
    registration_ends_with?: InputMaybe<Scalars['String']>
    registration_ends_with_nocase?: InputMaybe<Scalars['String']>
    registration_gt?: InputMaybe<Scalars['String']>
    registration_gte?: InputMaybe<Scalars['String']>
    registration_in?: InputMaybe<Array<Scalars['String']>>
    registration_lt?: InputMaybe<Scalars['String']>
    registration_lte?: InputMaybe<Scalars['String']>
    registration_not?: InputMaybe<Scalars['String']>
    registration_not_contains?: InputMaybe<Scalars['String']>
    registration_not_contains_nocase?: InputMaybe<Scalars['String']>
    registration_not_ends_with?: InputMaybe<Scalars['String']>
    registration_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    registration_not_in?: InputMaybe<Array<Scalars['String']>>
    registration_not_starts_with?: InputMaybe<Scalars['String']>
    registration_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    registration_starts_with?: InputMaybe<Scalars['String']>
    registration_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum NameRenewed_OrderBy {
    BlockNumber = 'blockNumber',
    ExpiryDate = 'expiryDate',
    Id = 'id',
    Registration = 'registration',
    RegistrationCost = 'registration__cost',
    RegistrationExpiryDate = 'registration__expiryDate',
    RegistrationId = 'registration__id',
    RegistrationLabelName = 'registration__labelName',
    RegistrationRegistrationDate = 'registration__registrationDate',
    TransactionId = 'transactionID'
}

export type NameTransferred = RegistrationEvent & {
    __typename?: 'NameTransferred'
    /** The block number of the event */
    blockNumber: Scalars['Int']
    /** The ID of the event */
    id: Scalars['ID']
    /** The new owner of the domain */
    newOwner: Account
    /** The registration associated with the event */
    registration: Registration
    /** The transaction ID of the event */
    transactionID: Scalars['Bytes']
}

export type NameTransferred_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<NameTransferred_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    newOwner?: InputMaybe<Scalars['String']>
    newOwner_?: InputMaybe<Account_Filter>
    newOwner_contains?: InputMaybe<Scalars['String']>
    newOwner_contains_nocase?: InputMaybe<Scalars['String']>
    newOwner_ends_with?: InputMaybe<Scalars['String']>
    newOwner_ends_with_nocase?: InputMaybe<Scalars['String']>
    newOwner_gt?: InputMaybe<Scalars['String']>
    newOwner_gte?: InputMaybe<Scalars['String']>
    newOwner_in?: InputMaybe<Array<Scalars['String']>>
    newOwner_lt?: InputMaybe<Scalars['String']>
    newOwner_lte?: InputMaybe<Scalars['String']>
    newOwner_not?: InputMaybe<Scalars['String']>
    newOwner_not_contains?: InputMaybe<Scalars['String']>
    newOwner_not_contains_nocase?: InputMaybe<Scalars['String']>
    newOwner_not_ends_with?: InputMaybe<Scalars['String']>
    newOwner_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    newOwner_not_in?: InputMaybe<Array<Scalars['String']>>
    newOwner_not_starts_with?: InputMaybe<Scalars['String']>
    newOwner_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    newOwner_starts_with?: InputMaybe<Scalars['String']>
    newOwner_starts_with_nocase?: InputMaybe<Scalars['String']>
    or?: InputMaybe<Array<InputMaybe<NameTransferred_Filter>>>
    registration?: InputMaybe<Scalars['String']>
    registration_?: InputMaybe<Registration_Filter>
    registration_contains?: InputMaybe<Scalars['String']>
    registration_contains_nocase?: InputMaybe<Scalars['String']>
    registration_ends_with?: InputMaybe<Scalars['String']>
    registration_ends_with_nocase?: InputMaybe<Scalars['String']>
    registration_gt?: InputMaybe<Scalars['String']>
    registration_gte?: InputMaybe<Scalars['String']>
    registration_in?: InputMaybe<Array<Scalars['String']>>
    registration_lt?: InputMaybe<Scalars['String']>
    registration_lte?: InputMaybe<Scalars['String']>
    registration_not?: InputMaybe<Scalars['String']>
    registration_not_contains?: InputMaybe<Scalars['String']>
    registration_not_contains_nocase?: InputMaybe<Scalars['String']>
    registration_not_ends_with?: InputMaybe<Scalars['String']>
    registration_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    registration_not_in?: InputMaybe<Array<Scalars['String']>>
    registration_not_starts_with?: InputMaybe<Scalars['String']>
    registration_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    registration_starts_with?: InputMaybe<Scalars['String']>
    registration_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum NameTransferred_OrderBy {
    BlockNumber = 'blockNumber',
    Id = 'id',
    NewOwner = 'newOwner',
    NewOwnerId = 'newOwner__id',
    Registration = 'registration',
    RegistrationCost = 'registration__cost',
    RegistrationExpiryDate = 'registration__expiryDate',
    RegistrationId = 'registration__id',
    RegistrationLabelName = 'registration__labelName',
    RegistrationRegistrationDate = 'registration__registrationDate',
    TransactionId = 'transactionID'
}

export type NameUnwrapped = DomainEvent & {
    __typename?: 'NameUnwrapped'
    /** The block number at which the event occurred */
    blockNumber: Scalars['Int']
    /** The domain name associated with the event */
    domain: Domain
    /** The unique identifier of the event */
    id: Scalars['ID']
    /** The account that owns the domain after it was unwrapped */
    owner: Account
    /** The transaction hash of the transaction that triggered the event */
    transactionID: Scalars['Bytes']
}

export type NameUnwrapped_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<NameUnwrapped_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    domain?: InputMaybe<Scalars['String']>
    domain_?: InputMaybe<Domain_Filter>
    domain_contains?: InputMaybe<Scalars['String']>
    domain_contains_nocase?: InputMaybe<Scalars['String']>
    domain_ends_with?: InputMaybe<Scalars['String']>
    domain_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_gt?: InputMaybe<Scalars['String']>
    domain_gte?: InputMaybe<Scalars['String']>
    domain_in?: InputMaybe<Array<Scalars['String']>>
    domain_lt?: InputMaybe<Scalars['String']>
    domain_lte?: InputMaybe<Scalars['String']>
    domain_not?: InputMaybe<Scalars['String']>
    domain_not_contains?: InputMaybe<Scalars['String']>
    domain_not_contains_nocase?: InputMaybe<Scalars['String']>
    domain_not_ends_with?: InputMaybe<Scalars['String']>
    domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_not_in?: InputMaybe<Array<Scalars['String']>>
    domain_not_starts_with?: InputMaybe<Scalars['String']>
    domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    domain_starts_with?: InputMaybe<Scalars['String']>
    domain_starts_with_nocase?: InputMaybe<Scalars['String']>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<NameUnwrapped_Filter>>>
    owner?: InputMaybe<Scalars['String']>
    owner_?: InputMaybe<Account_Filter>
    owner_contains?: InputMaybe<Scalars['String']>
    owner_contains_nocase?: InputMaybe<Scalars['String']>
    owner_ends_with?: InputMaybe<Scalars['String']>
    owner_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_gt?: InputMaybe<Scalars['String']>
    owner_gte?: InputMaybe<Scalars['String']>
    owner_in?: InputMaybe<Array<Scalars['String']>>
    owner_lt?: InputMaybe<Scalars['String']>
    owner_lte?: InputMaybe<Scalars['String']>
    owner_not?: InputMaybe<Scalars['String']>
    owner_not_contains?: InputMaybe<Scalars['String']>
    owner_not_contains_nocase?: InputMaybe<Scalars['String']>
    owner_not_ends_with?: InputMaybe<Scalars['String']>
    owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_not_in?: InputMaybe<Array<Scalars['String']>>
    owner_not_starts_with?: InputMaybe<Scalars['String']>
    owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    owner_starts_with?: InputMaybe<Scalars['String']>
    owner_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum NameUnwrapped_OrderBy {
    BlockNumber = 'blockNumber',
    Domain = 'domain',
    DomainCreatedAt = 'domain__createdAt',
    DomainExpiryDate = 'domain__expiryDate',
    DomainId = 'domain__id',
    DomainIsMigrated = 'domain__isMigrated',
    DomainLabelName = 'domain__labelName',
    DomainLabelhash = 'domain__labelhash',
    DomainName = 'domain__name',
    DomainSubdomainCount = 'domain__subdomainCount',
    DomainTtl = 'domain__ttl',
    Id = 'id',
    Owner = 'owner',
    OwnerId = 'owner__id',
    TransactionId = 'transactionID'
}

export type NameWrapped = DomainEvent & {
    __typename?: 'NameWrapped'
    /** The block number at which the wrapped domain was wrapped */
    blockNumber: Scalars['Int']
    /** The domain name associated with the wrapped domain */
    domain: Domain
    /** The expiry date of the wrapped domain registration */
    expiryDate: Scalars['BigInt']
    /** The number of fuses associated with the wrapped domain */
    fuses: Scalars['Int']
    /** The unique identifier of the wrapped domain */
    id: Scalars['ID']
    /** The human-readable name of the wrapped domain */
    name?: Maybe<Scalars['String']>
    /** The account that owns the wrapped domain */
    owner: Account
    /** The transaction hash of the transaction that wrapped the domain */
    transactionID: Scalars['Bytes']
}

export type NameWrapped_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<NameWrapped_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    domain?: InputMaybe<Scalars['String']>
    domain_?: InputMaybe<Domain_Filter>
    domain_contains?: InputMaybe<Scalars['String']>
    domain_contains_nocase?: InputMaybe<Scalars['String']>
    domain_ends_with?: InputMaybe<Scalars['String']>
    domain_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_gt?: InputMaybe<Scalars['String']>
    domain_gte?: InputMaybe<Scalars['String']>
    domain_in?: InputMaybe<Array<Scalars['String']>>
    domain_lt?: InputMaybe<Scalars['String']>
    domain_lte?: InputMaybe<Scalars['String']>
    domain_not?: InputMaybe<Scalars['String']>
    domain_not_contains?: InputMaybe<Scalars['String']>
    domain_not_contains_nocase?: InputMaybe<Scalars['String']>
    domain_not_ends_with?: InputMaybe<Scalars['String']>
    domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_not_in?: InputMaybe<Array<Scalars['String']>>
    domain_not_starts_with?: InputMaybe<Scalars['String']>
    domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    domain_starts_with?: InputMaybe<Scalars['String']>
    domain_starts_with_nocase?: InputMaybe<Scalars['String']>
    expiryDate?: InputMaybe<Scalars['BigInt']>
    expiryDate_gt?: InputMaybe<Scalars['BigInt']>
    expiryDate_gte?: InputMaybe<Scalars['BigInt']>
    expiryDate_in?: InputMaybe<Array<Scalars['BigInt']>>
    expiryDate_lt?: InputMaybe<Scalars['BigInt']>
    expiryDate_lte?: InputMaybe<Scalars['BigInt']>
    expiryDate_not?: InputMaybe<Scalars['BigInt']>
    expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>
    fuses?: InputMaybe<Scalars['Int']>
    fuses_gt?: InputMaybe<Scalars['Int']>
    fuses_gte?: InputMaybe<Scalars['Int']>
    fuses_in?: InputMaybe<Array<Scalars['Int']>>
    fuses_lt?: InputMaybe<Scalars['Int']>
    fuses_lte?: InputMaybe<Scalars['Int']>
    fuses_not?: InputMaybe<Scalars['Int']>
    fuses_not_in?: InputMaybe<Array<Scalars['Int']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    name?: InputMaybe<Scalars['String']>
    name_contains?: InputMaybe<Scalars['String']>
    name_contains_nocase?: InputMaybe<Scalars['String']>
    name_ends_with?: InputMaybe<Scalars['String']>
    name_ends_with_nocase?: InputMaybe<Scalars['String']>
    name_gt?: InputMaybe<Scalars['String']>
    name_gte?: InputMaybe<Scalars['String']>
    name_in?: InputMaybe<Array<Scalars['String']>>
    name_lt?: InputMaybe<Scalars['String']>
    name_lte?: InputMaybe<Scalars['String']>
    name_not?: InputMaybe<Scalars['String']>
    name_not_contains?: InputMaybe<Scalars['String']>
    name_not_contains_nocase?: InputMaybe<Scalars['String']>
    name_not_ends_with?: InputMaybe<Scalars['String']>
    name_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    name_not_in?: InputMaybe<Array<Scalars['String']>>
    name_not_starts_with?: InputMaybe<Scalars['String']>
    name_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    name_starts_with?: InputMaybe<Scalars['String']>
    name_starts_with_nocase?: InputMaybe<Scalars['String']>
    or?: InputMaybe<Array<InputMaybe<NameWrapped_Filter>>>
    owner?: InputMaybe<Scalars['String']>
    owner_?: InputMaybe<Account_Filter>
    owner_contains?: InputMaybe<Scalars['String']>
    owner_contains_nocase?: InputMaybe<Scalars['String']>
    owner_ends_with?: InputMaybe<Scalars['String']>
    owner_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_gt?: InputMaybe<Scalars['String']>
    owner_gte?: InputMaybe<Scalars['String']>
    owner_in?: InputMaybe<Array<Scalars['String']>>
    owner_lt?: InputMaybe<Scalars['String']>
    owner_lte?: InputMaybe<Scalars['String']>
    owner_not?: InputMaybe<Scalars['String']>
    owner_not_contains?: InputMaybe<Scalars['String']>
    owner_not_contains_nocase?: InputMaybe<Scalars['String']>
    owner_not_ends_with?: InputMaybe<Scalars['String']>
    owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_not_in?: InputMaybe<Array<Scalars['String']>>
    owner_not_starts_with?: InputMaybe<Scalars['String']>
    owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    owner_starts_with?: InputMaybe<Scalars['String']>
    owner_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum NameWrapped_OrderBy {
    BlockNumber = 'blockNumber',
    Domain = 'domain',
    DomainCreatedAt = 'domain__createdAt',
    DomainExpiryDate = 'domain__expiryDate',
    DomainId = 'domain__id',
    DomainIsMigrated = 'domain__isMigrated',
    DomainLabelName = 'domain__labelName',
    DomainLabelhash = 'domain__labelhash',
    DomainName = 'domain__name',
    DomainSubdomainCount = 'domain__subdomainCount',
    DomainTtl = 'domain__ttl',
    ExpiryDate = 'expiryDate',
    Fuses = 'fuses',
    Id = 'id',
    Name = 'name',
    Owner = 'owner',
    OwnerId = 'owner__id',
    TransactionId = 'transactionID'
}

export type NewOwner = DomainEvent & {
    __typename?: 'NewOwner'
    /** The block number at which the event occurred */
    blockNumber: Scalars['Int']
    /** The domain name associated with the event */
    domain: Domain
    /** The unique identifier of the event */
    id: Scalars['ID']
    /** The new account that owns the domain */
    owner: Account
    /** The parent domain of the domain name associated with the event */
    parentDomain: Domain
    /** The transaction hash of the transaction that triggered the event */
    transactionID: Scalars['Bytes']
}

export type NewOwner_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<NewOwner_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    domain?: InputMaybe<Scalars['String']>
    domain_?: InputMaybe<Domain_Filter>
    domain_contains?: InputMaybe<Scalars['String']>
    domain_contains_nocase?: InputMaybe<Scalars['String']>
    domain_ends_with?: InputMaybe<Scalars['String']>
    domain_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_gt?: InputMaybe<Scalars['String']>
    domain_gte?: InputMaybe<Scalars['String']>
    domain_in?: InputMaybe<Array<Scalars['String']>>
    domain_lt?: InputMaybe<Scalars['String']>
    domain_lte?: InputMaybe<Scalars['String']>
    domain_not?: InputMaybe<Scalars['String']>
    domain_not_contains?: InputMaybe<Scalars['String']>
    domain_not_contains_nocase?: InputMaybe<Scalars['String']>
    domain_not_ends_with?: InputMaybe<Scalars['String']>
    domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_not_in?: InputMaybe<Array<Scalars['String']>>
    domain_not_starts_with?: InputMaybe<Scalars['String']>
    domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    domain_starts_with?: InputMaybe<Scalars['String']>
    domain_starts_with_nocase?: InputMaybe<Scalars['String']>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<NewOwner_Filter>>>
    owner?: InputMaybe<Scalars['String']>
    owner_?: InputMaybe<Account_Filter>
    owner_contains?: InputMaybe<Scalars['String']>
    owner_contains_nocase?: InputMaybe<Scalars['String']>
    owner_ends_with?: InputMaybe<Scalars['String']>
    owner_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_gt?: InputMaybe<Scalars['String']>
    owner_gte?: InputMaybe<Scalars['String']>
    owner_in?: InputMaybe<Array<Scalars['String']>>
    owner_lt?: InputMaybe<Scalars['String']>
    owner_lte?: InputMaybe<Scalars['String']>
    owner_not?: InputMaybe<Scalars['String']>
    owner_not_contains?: InputMaybe<Scalars['String']>
    owner_not_contains_nocase?: InputMaybe<Scalars['String']>
    owner_not_ends_with?: InputMaybe<Scalars['String']>
    owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_not_in?: InputMaybe<Array<Scalars['String']>>
    owner_not_starts_with?: InputMaybe<Scalars['String']>
    owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    owner_starts_with?: InputMaybe<Scalars['String']>
    owner_starts_with_nocase?: InputMaybe<Scalars['String']>
    parentDomain?: InputMaybe<Scalars['String']>
    parentDomain_?: InputMaybe<Domain_Filter>
    parentDomain_contains?: InputMaybe<Scalars['String']>
    parentDomain_contains_nocase?: InputMaybe<Scalars['String']>
    parentDomain_ends_with?: InputMaybe<Scalars['String']>
    parentDomain_ends_with_nocase?: InputMaybe<Scalars['String']>
    parentDomain_gt?: InputMaybe<Scalars['String']>
    parentDomain_gte?: InputMaybe<Scalars['String']>
    parentDomain_in?: InputMaybe<Array<Scalars['String']>>
    parentDomain_lt?: InputMaybe<Scalars['String']>
    parentDomain_lte?: InputMaybe<Scalars['String']>
    parentDomain_not?: InputMaybe<Scalars['String']>
    parentDomain_not_contains?: InputMaybe<Scalars['String']>
    parentDomain_not_contains_nocase?: InputMaybe<Scalars['String']>
    parentDomain_not_ends_with?: InputMaybe<Scalars['String']>
    parentDomain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    parentDomain_not_in?: InputMaybe<Array<Scalars['String']>>
    parentDomain_not_starts_with?: InputMaybe<Scalars['String']>
    parentDomain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    parentDomain_starts_with?: InputMaybe<Scalars['String']>
    parentDomain_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum NewOwner_OrderBy {
    BlockNumber = 'blockNumber',
    Domain = 'domain',
    DomainCreatedAt = 'domain__createdAt',
    DomainExpiryDate = 'domain__expiryDate',
    DomainId = 'domain__id',
    DomainIsMigrated = 'domain__isMigrated',
    DomainLabelName = 'domain__labelName',
    DomainLabelhash = 'domain__labelhash',
    DomainName = 'domain__name',
    DomainSubdomainCount = 'domain__subdomainCount',
    DomainTtl = 'domain__ttl',
    Id = 'id',
    Owner = 'owner',
    OwnerId = 'owner__id',
    ParentDomain = 'parentDomain',
    ParentDomainCreatedAt = 'parentDomain__createdAt',
    ParentDomainExpiryDate = 'parentDomain__expiryDate',
    ParentDomainId = 'parentDomain__id',
    ParentDomainIsMigrated = 'parentDomain__isMigrated',
    ParentDomainLabelName = 'parentDomain__labelName',
    ParentDomainLabelhash = 'parentDomain__labelhash',
    ParentDomainName = 'parentDomain__name',
    ParentDomainSubdomainCount = 'parentDomain__subdomainCount',
    ParentDomainTtl = 'parentDomain__ttl',
    TransactionId = 'transactionID'
}

export type NewResolver = DomainEvent & {
    __typename?: 'NewResolver'
    /** The block number at which the event occurred */
    blockNumber: Scalars['Int']
    /** The domain name associated with the event */
    domain: Domain
    /** The unique identifier of the event */
    id: Scalars['ID']
    /** The new resolver contract address associated with the domain */
    resolver: Resolver
    /** The transaction hash of the transaction that triggered the event */
    transactionID: Scalars['Bytes']
}

export type NewResolver_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<NewResolver_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    domain?: InputMaybe<Scalars['String']>
    domain_?: InputMaybe<Domain_Filter>
    domain_contains?: InputMaybe<Scalars['String']>
    domain_contains_nocase?: InputMaybe<Scalars['String']>
    domain_ends_with?: InputMaybe<Scalars['String']>
    domain_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_gt?: InputMaybe<Scalars['String']>
    domain_gte?: InputMaybe<Scalars['String']>
    domain_in?: InputMaybe<Array<Scalars['String']>>
    domain_lt?: InputMaybe<Scalars['String']>
    domain_lte?: InputMaybe<Scalars['String']>
    domain_not?: InputMaybe<Scalars['String']>
    domain_not_contains?: InputMaybe<Scalars['String']>
    domain_not_contains_nocase?: InputMaybe<Scalars['String']>
    domain_not_ends_with?: InputMaybe<Scalars['String']>
    domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_not_in?: InputMaybe<Array<Scalars['String']>>
    domain_not_starts_with?: InputMaybe<Scalars['String']>
    domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    domain_starts_with?: InputMaybe<Scalars['String']>
    domain_starts_with_nocase?: InputMaybe<Scalars['String']>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<NewResolver_Filter>>>
    resolver?: InputMaybe<Scalars['String']>
    resolver_?: InputMaybe<Resolver_Filter>
    resolver_contains?: InputMaybe<Scalars['String']>
    resolver_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_ends_with?: InputMaybe<Scalars['String']>
    resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_gt?: InputMaybe<Scalars['String']>
    resolver_gte?: InputMaybe<Scalars['String']>
    resolver_in?: InputMaybe<Array<Scalars['String']>>
    resolver_lt?: InputMaybe<Scalars['String']>
    resolver_lte?: InputMaybe<Scalars['String']>
    resolver_not?: InputMaybe<Scalars['String']>
    resolver_not_contains?: InputMaybe<Scalars['String']>
    resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_not_ends_with?: InputMaybe<Scalars['String']>
    resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_not_in?: InputMaybe<Array<Scalars['String']>>
    resolver_not_starts_with?: InputMaybe<Scalars['String']>
    resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver_starts_with?: InputMaybe<Scalars['String']>
    resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum NewResolver_OrderBy {
    BlockNumber = 'blockNumber',
    Domain = 'domain',
    DomainCreatedAt = 'domain__createdAt',
    DomainExpiryDate = 'domain__expiryDate',
    DomainId = 'domain__id',
    DomainIsMigrated = 'domain__isMigrated',
    DomainLabelName = 'domain__labelName',
    DomainLabelhash = 'domain__labelhash',
    DomainName = 'domain__name',
    DomainSubdomainCount = 'domain__subdomainCount',
    DomainTtl = 'domain__ttl',
    Id = 'id',
    Resolver = 'resolver',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    TransactionId = 'transactionID'
}

export type NewTtl = DomainEvent & {
    __typename?: 'NewTTL'
    /** The block number at which the event occurred */
    blockNumber: Scalars['Int']
    /** The domain name associated with the event */
    domain: Domain
    /** The unique identifier of the event */
    id: Scalars['ID']
    /** The transaction hash of the transaction that triggered the event */
    transactionID: Scalars['Bytes']
    /** The new TTL value (in seconds) associated with the domain */
    ttl: Scalars['BigInt']
}

export type NewTtl_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<NewTtl_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    domain?: InputMaybe<Scalars['String']>
    domain_?: InputMaybe<Domain_Filter>
    domain_contains?: InputMaybe<Scalars['String']>
    domain_contains_nocase?: InputMaybe<Scalars['String']>
    domain_ends_with?: InputMaybe<Scalars['String']>
    domain_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_gt?: InputMaybe<Scalars['String']>
    domain_gte?: InputMaybe<Scalars['String']>
    domain_in?: InputMaybe<Array<Scalars['String']>>
    domain_lt?: InputMaybe<Scalars['String']>
    domain_lte?: InputMaybe<Scalars['String']>
    domain_not?: InputMaybe<Scalars['String']>
    domain_not_contains?: InputMaybe<Scalars['String']>
    domain_not_contains_nocase?: InputMaybe<Scalars['String']>
    domain_not_ends_with?: InputMaybe<Scalars['String']>
    domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_not_in?: InputMaybe<Array<Scalars['String']>>
    domain_not_starts_with?: InputMaybe<Scalars['String']>
    domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    domain_starts_with?: InputMaybe<Scalars['String']>
    domain_starts_with_nocase?: InputMaybe<Scalars['String']>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<NewTtl_Filter>>>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    ttl?: InputMaybe<Scalars['BigInt']>
    ttl_gt?: InputMaybe<Scalars['BigInt']>
    ttl_gte?: InputMaybe<Scalars['BigInt']>
    ttl_in?: InputMaybe<Array<Scalars['BigInt']>>
    ttl_lt?: InputMaybe<Scalars['BigInt']>
    ttl_lte?: InputMaybe<Scalars['BigInt']>
    ttl_not?: InputMaybe<Scalars['BigInt']>
    ttl_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export enum NewTtl_OrderBy {
    BlockNumber = 'blockNumber',
    Domain = 'domain',
    DomainCreatedAt = 'domain__createdAt',
    DomainExpiryDate = 'domain__expiryDate',
    DomainId = 'domain__id',
    DomainIsMigrated = 'domain__isMigrated',
    DomainLabelName = 'domain__labelName',
    DomainLabelhash = 'domain__labelhash',
    DomainName = 'domain__name',
    DomainSubdomainCount = 'domain__subdomainCount',
    DomainTtl = 'domain__ttl',
    Id = 'id',
    TransactionId = 'transactionID',
    Ttl = 'ttl'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
    Asc = 'asc',
    Desc = 'desc'
}

export type PendingTransactions = {
    __typename?: 'PendingTransactions'
    items: Array<Tx>
    nextKey?: Maybe<Scalars['String']>
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

export type PubkeyChanged = ResolverEvent & {
    __typename?: 'PubkeyChanged'
    /** Block number of the Ethereum block where the event occurred */
    blockNumber: Scalars['Int']
    /** Concatenation of block number and log ID */
    id: Scalars['ID']
    /** Used to derive relationships to Resolvers */
    resolver: Resolver
    /** Transaction hash of the Ethereum transaction where the event occurred */
    transactionID: Scalars['Bytes']
    /** The x-coordinate of the new public key */
    x: Scalars['Bytes']
    /** The y-coordinate of the new public key */
    y: Scalars['Bytes']
}

export type PubkeyChanged_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<PubkeyChanged_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<PubkeyChanged_Filter>>>
    resolver?: InputMaybe<Scalars['String']>
    resolver_?: InputMaybe<Resolver_Filter>
    resolver_contains?: InputMaybe<Scalars['String']>
    resolver_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_ends_with?: InputMaybe<Scalars['String']>
    resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_gt?: InputMaybe<Scalars['String']>
    resolver_gte?: InputMaybe<Scalars['String']>
    resolver_in?: InputMaybe<Array<Scalars['String']>>
    resolver_lt?: InputMaybe<Scalars['String']>
    resolver_lte?: InputMaybe<Scalars['String']>
    resolver_not?: InputMaybe<Scalars['String']>
    resolver_not_contains?: InputMaybe<Scalars['String']>
    resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_not_ends_with?: InputMaybe<Scalars['String']>
    resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_not_in?: InputMaybe<Array<Scalars['String']>>
    resolver_not_starts_with?: InputMaybe<Scalars['String']>
    resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver_starts_with?: InputMaybe<Scalars['String']>
    resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    x?: InputMaybe<Scalars['Bytes']>
    x_contains?: InputMaybe<Scalars['Bytes']>
    x_gt?: InputMaybe<Scalars['Bytes']>
    x_gte?: InputMaybe<Scalars['Bytes']>
    x_in?: InputMaybe<Array<Scalars['Bytes']>>
    x_lt?: InputMaybe<Scalars['Bytes']>
    x_lte?: InputMaybe<Scalars['Bytes']>
    x_not?: InputMaybe<Scalars['Bytes']>
    x_not_contains?: InputMaybe<Scalars['Bytes']>
    x_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    y?: InputMaybe<Scalars['Bytes']>
    y_contains?: InputMaybe<Scalars['Bytes']>
    y_gt?: InputMaybe<Scalars['Bytes']>
    y_gte?: InputMaybe<Scalars['Bytes']>
    y_in?: InputMaybe<Array<Scalars['Bytes']>>
    y_lt?: InputMaybe<Scalars['Bytes']>
    y_lte?: InputMaybe<Scalars['Bytes']>
    y_not?: InputMaybe<Scalars['Bytes']>
    y_not_contains?: InputMaybe<Scalars['Bytes']>
    y_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum PubkeyChanged_OrderBy {
    BlockNumber = 'blockNumber',
    Id = 'id',
    Resolver = 'resolver',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    TransactionId = 'transactionID',
    X = 'x',
    Y = 'y'
}

export type Query = {
    __typename?: 'Query'
    /** Access to subgraph metadata */
    _meta?: Maybe<_Meta_>
    abiChanged?: Maybe<AbiChanged>
    abiChangeds: Array<AbiChanged>
    account?: Maybe<Account>
    accounts: Array<Account>
    addrChanged?: Maybe<AddrChanged>
    addrChangeds: Array<AddrChanged>
    authorisationChanged?: Maybe<AuthorisationChanged>
    authorisationChangeds: Array<AuthorisationChanged>
    contenthashChanged?: Maybe<ContenthashChanged>
    contenthashChangeds: Array<ContenthashChanged>
    domain?: Maybe<Domain>
    domainEvent?: Maybe<DomainEvent>
    domainEvents: Array<DomainEvent>
    domains: Array<Domain>
    expiryExtended?: Maybe<ExpiryExtended>
    expiryExtendeds: Array<ExpiryExtended>
    fdfashtwjnakfgn: EthTransfers
    fusesSet?: Maybe<FusesSet>
    fusesSets: Array<FusesSet>
    getAllEthTransfers: EthTransfers
    getAllTransfers: AllTransfers
    getAllTransfersWithErrorsByAddress: AllTransfersWithErrors
    getBlockByHash: Block
    getBlockByNumber: Block
    getBlockRewards: EthTransfers
    getBlockTransfers: EthTransfers
    getBlocksArrayByNumber: Array<Maybe<BlockSummary>>
    /** Get info of all CoinGecko tokens */
    getCoinGeckoTokenInfoAll: Array<CoinGeckoTokenInfo>
    /** Get info of all CoinGecko tokens by their address */
    getCoinGeckoTokenInfoByAddresses: Array<Maybe<CoinGeckoTokenInfo>>
    /**
     * Get the market data of tokens on CoinGecko by their CoinGecko IDs
     * For id's that are not found the response array element will be null
     */
    getCoinGeckoTokenMarketDataByIds: Array<Maybe<CoinGeckoTokenMarketDataItem>>
    /** Get the prices of all tokens on CoinGecko */
    getCoinGeckoTokenPriceAll: Array<CoinGeckoTokenPrice>
    getContractMeta: ContractMeta
    /** Get the number of ERC20 tokens of a contract owned by an address */
    getERC20TokenBalance: Erc20TokenBalance
    /** Get the owners of an ERC20 token */
    getERC20TokenOwners: Erc20TokenOwners
    getERC20TokenTransfers: Erc20Transfers
    getERC20Transfers: Erc20Transfers
    getERC20TransfersByHash: Erc20Transfers
    /** Get the count of ERC721 tokens of a contract that are owned by the address */
    getERC721TokenBalance: Erc721TokenBalance
    /** Get addresses owning a contract's ERC721 tokens */
    getERC721TokenOwners: Erc721TokenOwners
    getERC721TokenTransfers: Erc721Transfers
    getERC721Transfers: Erc721Transfers
    getERC1155TokenTransfers: Erc1155Transfers
    /** Get ERC1155 tokens belonging to a contract */
    getERC1155TokensByContract: Erc1155TokenBalances
    /** Get ERC1155 tokens owned by an address */
    getERC1155TokensByOwner: Erc1155TokenBalances
    getERC1155Transfers: Erc1155Transfers
    getEthBalance: EthOwner
    getEthInternalTransactionTransfers: EthTransfers
    getEthOwners: EthOwners
    getEthTransactionTransfers: EthTransactionTransfers
    getEthTransfers: EthTransfers
    getEthTransfersByHash: EthTransfers
    getEthTransfersV2: EthTransfers
    getEthWithdrawalTransfers: EthWithdrawalTransfers
    getGenesisRewards: EthTransfers
    getHashType: HashType
    getLatestBlockInfo: LatestBlockData
    getLatestPrices: Array<Maybe<TokenMarketInfo>>
    getNFTContractMeta?: Maybe<RespCollections>
    getNFTTokensMeta?: Maybe<RespTokens>
    getNFTTransfers: NftTransfers
    getNFTTransfersByHash: NftTransfers
    getNFTcontractsMeta: AddressNfTcontracts
    /** Get ERC20 tokens owned by an address */
    getOwnersERC20Tokens: Erc20TokenOwners
    /** Get ERC721 tokens owned by an address */
    getOwnersERC721Balances: Array<Erc721TokenBalance>
    /** Get ERC721 tokens of a contract owned by an address */
    getOwnersERC721Tokens: Erc721TokenContract
    /** Get ERC721 tokens of a contract owned by an address (v2) */
    getOwnersERC721TokensV2: Erc721TokenContract
    /** Get ETH and ERC20 tokens owned by an address */
    getOwnersETHAndERC20Tokens: EthAndErc20TokenBalances
    /** Get the total number of NFT's owned by an address */
    getOwnersNFTBalance: NftTokenBalance
    getOwnersNFTTokens: NftTokens
    getPendingTransactions: Array<Maybe<Tx>>
    /**
     * get pending transactions to or from an address
     * supports keyset pagination with nextKey
     */
    getPendingTransactionsV2: PendingTransactions
    /** deprecated */
    getTimeseriesData: TimeseriesResponse
    /** Returns the current server time in UTC milliseconds */
    getTimestamp: Scalars['String']
    getTokenInfoByContract: EthTokenInfo
    getTokenInfoByContracts: Array<EthTokenInfo>
    /** Query tokens that have had noteworthy price changes recently */
    getTokenMarketMovers: GetTokenMarketMoversResult
    getTokensBeginsWith: Array<Maybe<TokenSearch>>
    getTransactionByHash: Tx
    getTransactionByHashWithTraces: Tx
    getTransactionStateDiff: Array<Maybe<TxStateDiff>>
    getTransactionsByHashes: Array<Maybe<Tx>>
    getUncleByHash: Uncle
    getUncleRewards: EthTransfers
    interfaceChanged?: Maybe<InterfaceChanged>
    interfaceChangeds: Array<InterfaceChanged>
    /** Get all the changed Erc20 balances for a given block number */
    mmGetErc20BalanceDeltasByBlockNumber: MmGetErc20BalanceDeltasByBlockNumberResult
    /** Get the token balances of an address on Ethereum */
    mmGetEthAndErc20BalancesWithPricesByOwnerAddress: MmGetEthAndErc20BalancesWithPricesByOwnerAddressResult
    /** Get all the changed Eth balances for a given block number */
    mmGetEthBalanceDeltasByBlockNumber: MmGetEthBalanceDeltasByBlockNumberResult
    /** Get a paginated list of market data of all tokens on a chain */
    mmGetTokenMarketDataByChain: MmGetTokenMarketDataByChainResult
    /**
     * Get the market data of the given tokens on a chain
     *
     * Results are returned in the same order as the given addresses
     *
     * If an address is not found then the result will be null for that address
     */
    mmGetTokenMarketDataByChainAndContractAddresses: MmGetTokenMarketDataByChainAndContractAddressesResult
    /** Query tokens that have had noteworthy price changes recently */
    mmGetTokenMarketMoversByChain: MmGetTokenMarketMoversByChainResult
    mmGetTransfersByBlockNumber: MmGetTransfersByBlockNumberResult
    /**
     * Full text search for a token by name, symbol, or contract address
     *
     * Returns a list of tokens and native currencies that match the search query ordered by relevance and market cap
     */
    mmSearchTokenByChain: MmSearchTokenByChainResult
    multicoinAddrChanged?: Maybe<MulticoinAddrChanged>
    multicoinAddrChangeds: Array<MulticoinAddrChanged>
    nameChanged?: Maybe<NameChanged>
    nameChangeds: Array<NameChanged>
    nameRegistered?: Maybe<NameRegistered>
    nameRegistereds: Array<NameRegistered>
    nameRenewed?: Maybe<NameRenewed>
    nameReneweds: Array<NameRenewed>
    nameTransferred?: Maybe<NameTransferred>
    nameTransferreds: Array<NameTransferred>
    nameUnwrapped?: Maybe<NameUnwrapped>
    nameUnwrappeds: Array<NameUnwrapped>
    nameWrapped?: Maybe<NameWrapped>
    nameWrappeds: Array<NameWrapped>
    newOwner?: Maybe<NewOwner>
    newOwners: Array<NewOwner>
    newResolver?: Maybe<NewResolver>
    newResolvers: Array<NewResolver>
    newTTL?: Maybe<NewTtl>
    newTTLs: Array<NewTtl>
    pubkeyChanged?: Maybe<PubkeyChanged>
    pubkeyChangeds: Array<PubkeyChanged>
    registration?: Maybe<Registration>
    registrationEvent?: Maybe<RegistrationEvent>
    registrationEvents: Array<RegistrationEvent>
    registrations: Array<Registration>
    resolver?: Maybe<Resolver>
    resolverEvent?: Maybe<ResolverEvent>
    resolverEvents: Array<ResolverEvent>
    resolvers: Array<Resolver>
    textChanged?: Maybe<TextChanged>
    textChangeds: Array<TextChanged>
    transfer?: Maybe<Transfer>
    transfers: Array<Transfer>
    versionChanged?: Maybe<VersionChanged>
    versionChangeds: Array<VersionChanged>
    wrappedDomain?: Maybe<WrappedDomain>
    wrappedDomains: Array<WrappedDomain>
    wrappedTransfer?: Maybe<WrappedTransfer>
    wrappedTransfers: Array<WrappedTransfer>
}

export type Query_MetaArgs = {
    block?: InputMaybe<Block_Height>
}

export type QueryAbiChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryAbiChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<AbiChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<AbiChanged_Filter>
}

export type QueryAccountArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryAccountsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<Account_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<Account_Filter>
}

export type QueryAddrChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryAddrChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<AddrChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<AddrChanged_Filter>
}

export type QueryAuthorisationChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryAuthorisationChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<AuthorisationChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<AuthorisationChanged_Filter>
}

export type QueryContenthashChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryContenthashChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<ContenthashChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<ContenthashChanged_Filter>
}

export type QueryDomainArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryDomainEventArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryDomainEventsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<DomainEvent_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<DomainEvent_Filter>
}

export type QueryDomainsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<Domain_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<Domain_Filter>
}

export type QueryExpiryExtendedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryExpiryExtendedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<ExpiryExtended_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<ExpiryExtended_Filter>
}

export type QueryFdfashtwjnakfgnArgs = {
    direction?: InputMaybe<TransferDirection>
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
}

export type QueryFusesSetArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryFusesSetsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<FusesSet_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<FusesSet_Filter>
}

export type QueryGetAllEthTransfersArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
}

export type QueryGetAllTransfersArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
}

export type QueryGetAllTransfersWithErrorsByAddressArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner: Scalars['String']
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
    owner?: InputMaybe<Scalars['String']>
}

export type QueryGetBlockTransfersArgs = {
    number?: InputMaybe<Scalars['Int']>
}

export type QueryGetBlocksArrayByNumberArgs = {
    fromBlock?: InputMaybe<Scalars['Int']>
    limit?: InputMaybe<Scalars['Int']>
}

export type QueryGetCoinGeckoTokenInfoByAddressesArgs = {
    addresses: Array<Scalars['String']>
}

export type QueryGetCoinGeckoTokenMarketDataByIdsArgs = {
    coinGeckoTokenIds: Array<Scalars['String']>
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

export type QueryGetErc20TransfersByHashArgs = {
    direction?: InputMaybe<TransferDirection>
    hash: Scalars['String']
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
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

export type QueryGetErc1155TokenTransfersArgs = {
    contract: Scalars['String']
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryGetErc1155TokensByContractArgs = {
    contract: Scalars['String']
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryGetErc1155TokensByOwnerArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner: Scalars['String']
}

export type QueryGetErc1155TransfersArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
}

export type QueryGetEthBalanceArgs = {
    owner: Scalars['String']
}

export type QueryGetEthInternalTransactionTransfersArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
}

export type QueryGetEthOwnersArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryGetEthTransactionTransfersArgs = {
    direction?: InputMaybe<TransferDirection>
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
}

export type QueryGetEthTransfersArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
}

export type QueryGetEthTransfersByHashArgs = {
    hash: Scalars['String']
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
}

export type QueryGetEthTransfersV2Args = {
    direction?: InputMaybe<TransferDirection>
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
}

export type QueryGetEthWithdrawalTransfersArgs = {
    address?: InputMaybe<Scalars['String']>
    blockNumber?: InputMaybe<Scalars['Int']>
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryGetGenesisRewardsArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
}

export type QueryGetHashTypeArgs = {
    hash: Scalars['String']
}

export type QueryGetNftContractMetaArgs = {
    input: Scalars['String']
}

export type QueryGetNftTokensMetaArgs = {
    input: Scalars['String']
}

export type QueryGetNftTransfersArgs = {
    address?: InputMaybe<Scalars['String']>
    direction?: InputMaybe<TransferDirection>
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryGetNftTransfersByHashArgs = {
    direction?: InputMaybe<TransferDirection>
    hash: Scalars['String']
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner?: InputMaybe<Scalars['String']>
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

export type QueryGetOwnersErc721TokensV2Args = {
    contract?: InputMaybe<Scalars['String']>
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner: Scalars['String']
}

export type QueryGetOwnersEthAndErc20TokensArgs = {
    owner: Scalars['String']
}

export type QueryGetOwnersNftBalanceArgs = {
    address: Scalars['String']
}

export type QueryGetOwnersNftTokensArgs = {
    address: Scalars['String']
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryGetPendingTransactionsArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    owner: Scalars['String']
}

export type QueryGetPendingTransactionsV2Args = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
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
    owner?: InputMaybe<Scalars['String']>
}

export type QueryInterfaceChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryInterfaceChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<InterfaceChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<InterfaceChanged_Filter>
}

export type QueryMmGetErc20BalanceDeltasByBlockNumberArgs = {
    blockNumber: Scalars['Int']
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryMmGetEthAndErc20BalancesWithPricesByOwnerAddressArgs = {
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    ownerAddress: Scalars['String']
}

export type QueryMmGetEthBalanceDeltasByBlockNumberArgs = {
    blockNumber: Scalars['Int']
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryMmGetTokenMarketDataByChainArgs = {
    chain: MmChain
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
    noQualityControl?: InputMaybe<Scalars['Boolean']>
    sortBy?: InputMaybe<MmTokenMarketDataByChainSortOption>
    sortDirection?: InputMaybe<MmSortDirection>
}

export type QueryMmGetTokenMarketDataByChainAndContractAddressesArgs = {
    chain: MmChain
    contractAddresses: Array<Scalars['String']>
}

export type QueryMmGetTokenMarketMoversByChainArgs = {
    chain: MmChain
}

export type QueryMmGetTransfersByBlockNumberArgs = {
    blockNumber: Scalars['Int']
    limit?: InputMaybe<Scalars['Int']>
    nextKey?: InputMaybe<Scalars['String']>
}

export type QueryMmSearchTokenByChainArgs = {
    chain: MmChain
    search: Scalars['String']
}

export type QueryMulticoinAddrChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryMulticoinAddrChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<MulticoinAddrChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<MulticoinAddrChanged_Filter>
}

export type QueryNameChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryNameChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NameChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NameChanged_Filter>
}

export type QueryNameRegisteredArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryNameRegisteredsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NameRegistered_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NameRegistered_Filter>
}

export type QueryNameRenewedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryNameRenewedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NameRenewed_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NameRenewed_Filter>
}

export type QueryNameTransferredArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryNameTransferredsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NameTransferred_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NameTransferred_Filter>
}

export type QueryNameUnwrappedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryNameUnwrappedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NameUnwrapped_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NameUnwrapped_Filter>
}

export type QueryNameWrappedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryNameWrappedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NameWrapped_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NameWrapped_Filter>
}

export type QueryNewOwnerArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryNewOwnersArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NewOwner_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NewOwner_Filter>
}

export type QueryNewResolverArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryNewResolversArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NewResolver_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NewResolver_Filter>
}

export type QueryNewTtlArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryNewTtLsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NewTtl_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NewTtl_Filter>
}

export type QueryPubkeyChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryPubkeyChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<PubkeyChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<PubkeyChanged_Filter>
}

export type QueryRegistrationArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryRegistrationEventArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryRegistrationEventsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<RegistrationEvent_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<RegistrationEvent_Filter>
}

export type QueryRegistrationsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<Registration_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<Registration_Filter>
}

export type QueryResolverArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryResolverEventArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryResolverEventsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<ResolverEvent_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<ResolverEvent_Filter>
}

export type QueryResolversArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<Resolver_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<Resolver_Filter>
}

export type QueryTextChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryTextChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<TextChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<TextChanged_Filter>
}

export type QueryTransferArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryTransfersArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<Transfer_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<Transfer_Filter>
}

export type QueryVersionChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryVersionChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<VersionChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<VersionChanged_Filter>
}

export type QueryWrappedDomainArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryWrappedDomainsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<WrappedDomain_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<WrappedDomain_Filter>
}

export type QueryWrappedTransferArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type QueryWrappedTransfersArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<WrappedTransfer_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<WrappedTransfer_Filter>
}

export type Registration = {
    __typename?: 'Registration'
    /** The cost associated with the domain registration */
    cost?: Maybe<Scalars['BigInt']>
    /** The domain name associated with the registration */
    domain: Domain
    /** The events associated with the domain registration */
    events: Array<RegistrationEvent>
    /** The expiry date of the domain */
    expiryDate: Scalars['BigInt']
    /** The unique identifier of the registration */
    id: Scalars['ID']
    /** The human-readable label name associated with the domain registration */
    labelName?: Maybe<Scalars['String']>
    /** The account that registered the domain */
    registrant: Account
    /** The registration date of the domain */
    registrationDate: Scalars['BigInt']
}

export type RegistrationEventsArgs = {
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<RegistrationEvent_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    where?: InputMaybe<RegistrationEvent_Filter>
}

export type RegistrationEvent = {
    /** The block number of the event */
    blockNumber: Scalars['Int']
    /** The unique identifier of the registration event */
    id: Scalars['ID']
    /** The registration associated with the event */
    registration: Registration
    /** The transaction ID associated with the event */
    transactionID: Scalars['Bytes']
}

export type RegistrationEvent_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<RegistrationEvent_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<RegistrationEvent_Filter>>>
    registration?: InputMaybe<Scalars['String']>
    registration_?: InputMaybe<Registration_Filter>
    registration_contains?: InputMaybe<Scalars['String']>
    registration_contains_nocase?: InputMaybe<Scalars['String']>
    registration_ends_with?: InputMaybe<Scalars['String']>
    registration_ends_with_nocase?: InputMaybe<Scalars['String']>
    registration_gt?: InputMaybe<Scalars['String']>
    registration_gte?: InputMaybe<Scalars['String']>
    registration_in?: InputMaybe<Array<Scalars['String']>>
    registration_lt?: InputMaybe<Scalars['String']>
    registration_lte?: InputMaybe<Scalars['String']>
    registration_not?: InputMaybe<Scalars['String']>
    registration_not_contains?: InputMaybe<Scalars['String']>
    registration_not_contains_nocase?: InputMaybe<Scalars['String']>
    registration_not_ends_with?: InputMaybe<Scalars['String']>
    registration_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    registration_not_in?: InputMaybe<Array<Scalars['String']>>
    registration_not_starts_with?: InputMaybe<Scalars['String']>
    registration_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    registration_starts_with?: InputMaybe<Scalars['String']>
    registration_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum RegistrationEvent_OrderBy {
    BlockNumber = 'blockNumber',
    Id = 'id',
    Registration = 'registration',
    RegistrationCost = 'registration__cost',
    RegistrationExpiryDate = 'registration__expiryDate',
    RegistrationId = 'registration__id',
    RegistrationLabelName = 'registration__labelName',
    RegistrationRegistrationDate = 'registration__registrationDate',
    TransactionId = 'transactionID'
}

export type Registration_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<Registration_Filter>>>
    cost?: InputMaybe<Scalars['BigInt']>
    cost_gt?: InputMaybe<Scalars['BigInt']>
    cost_gte?: InputMaybe<Scalars['BigInt']>
    cost_in?: InputMaybe<Array<Scalars['BigInt']>>
    cost_lt?: InputMaybe<Scalars['BigInt']>
    cost_lte?: InputMaybe<Scalars['BigInt']>
    cost_not?: InputMaybe<Scalars['BigInt']>
    cost_not_in?: InputMaybe<Array<Scalars['BigInt']>>
    domain?: InputMaybe<Scalars['String']>
    domain_?: InputMaybe<Domain_Filter>
    domain_contains?: InputMaybe<Scalars['String']>
    domain_contains_nocase?: InputMaybe<Scalars['String']>
    domain_ends_with?: InputMaybe<Scalars['String']>
    domain_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_gt?: InputMaybe<Scalars['String']>
    domain_gte?: InputMaybe<Scalars['String']>
    domain_in?: InputMaybe<Array<Scalars['String']>>
    domain_lt?: InputMaybe<Scalars['String']>
    domain_lte?: InputMaybe<Scalars['String']>
    domain_not?: InputMaybe<Scalars['String']>
    domain_not_contains?: InputMaybe<Scalars['String']>
    domain_not_contains_nocase?: InputMaybe<Scalars['String']>
    domain_not_ends_with?: InputMaybe<Scalars['String']>
    domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_not_in?: InputMaybe<Array<Scalars['String']>>
    domain_not_starts_with?: InputMaybe<Scalars['String']>
    domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    domain_starts_with?: InputMaybe<Scalars['String']>
    domain_starts_with_nocase?: InputMaybe<Scalars['String']>
    events_?: InputMaybe<RegistrationEvent_Filter>
    expiryDate?: InputMaybe<Scalars['BigInt']>
    expiryDate_gt?: InputMaybe<Scalars['BigInt']>
    expiryDate_gte?: InputMaybe<Scalars['BigInt']>
    expiryDate_in?: InputMaybe<Array<Scalars['BigInt']>>
    expiryDate_lt?: InputMaybe<Scalars['BigInt']>
    expiryDate_lte?: InputMaybe<Scalars['BigInt']>
    expiryDate_not?: InputMaybe<Scalars['BigInt']>
    expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    labelName?: InputMaybe<Scalars['String']>
    labelName_contains?: InputMaybe<Scalars['String']>
    labelName_contains_nocase?: InputMaybe<Scalars['String']>
    labelName_ends_with?: InputMaybe<Scalars['String']>
    labelName_ends_with_nocase?: InputMaybe<Scalars['String']>
    labelName_gt?: InputMaybe<Scalars['String']>
    labelName_gte?: InputMaybe<Scalars['String']>
    labelName_in?: InputMaybe<Array<Scalars['String']>>
    labelName_lt?: InputMaybe<Scalars['String']>
    labelName_lte?: InputMaybe<Scalars['String']>
    labelName_not?: InputMaybe<Scalars['String']>
    labelName_not_contains?: InputMaybe<Scalars['String']>
    labelName_not_contains_nocase?: InputMaybe<Scalars['String']>
    labelName_not_ends_with?: InputMaybe<Scalars['String']>
    labelName_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    labelName_not_in?: InputMaybe<Array<Scalars['String']>>
    labelName_not_starts_with?: InputMaybe<Scalars['String']>
    labelName_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    labelName_starts_with?: InputMaybe<Scalars['String']>
    labelName_starts_with_nocase?: InputMaybe<Scalars['String']>
    or?: InputMaybe<Array<InputMaybe<Registration_Filter>>>
    registrant?: InputMaybe<Scalars['String']>
    registrant_?: InputMaybe<Account_Filter>
    registrant_contains?: InputMaybe<Scalars['String']>
    registrant_contains_nocase?: InputMaybe<Scalars['String']>
    registrant_ends_with?: InputMaybe<Scalars['String']>
    registrant_ends_with_nocase?: InputMaybe<Scalars['String']>
    registrant_gt?: InputMaybe<Scalars['String']>
    registrant_gte?: InputMaybe<Scalars['String']>
    registrant_in?: InputMaybe<Array<Scalars['String']>>
    registrant_lt?: InputMaybe<Scalars['String']>
    registrant_lte?: InputMaybe<Scalars['String']>
    registrant_not?: InputMaybe<Scalars['String']>
    registrant_not_contains?: InputMaybe<Scalars['String']>
    registrant_not_contains_nocase?: InputMaybe<Scalars['String']>
    registrant_not_ends_with?: InputMaybe<Scalars['String']>
    registrant_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    registrant_not_in?: InputMaybe<Array<Scalars['String']>>
    registrant_not_starts_with?: InputMaybe<Scalars['String']>
    registrant_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    registrant_starts_with?: InputMaybe<Scalars['String']>
    registrant_starts_with_nocase?: InputMaybe<Scalars['String']>
    registrationDate?: InputMaybe<Scalars['BigInt']>
    registrationDate_gt?: InputMaybe<Scalars['BigInt']>
    registrationDate_gte?: InputMaybe<Scalars['BigInt']>
    registrationDate_in?: InputMaybe<Array<Scalars['BigInt']>>
    registrationDate_lt?: InputMaybe<Scalars['BigInt']>
    registrationDate_lte?: InputMaybe<Scalars['BigInt']>
    registrationDate_not?: InputMaybe<Scalars['BigInt']>
    registrationDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export enum Registration_OrderBy {
    Cost = 'cost',
    Domain = 'domain',
    DomainCreatedAt = 'domain__createdAt',
    DomainExpiryDate = 'domain__expiryDate',
    DomainId = 'domain__id',
    DomainIsMigrated = 'domain__isMigrated',
    DomainLabelName = 'domain__labelName',
    DomainLabelhash = 'domain__labelhash',
    DomainName = 'domain__name',
    DomainSubdomainCount = 'domain__subdomainCount',
    DomainTtl = 'domain__ttl',
    Events = 'events',
    ExpiryDate = 'expiryDate',
    Id = 'id',
    LabelName = 'labelName',
    Registrant = 'registrant',
    RegistrantId = 'registrant__id',
    RegistrationDate = 'registrationDate'
}

export type Resolver = {
    __typename?: 'Resolver'
    /** The current value of the 'addr' record for this resolver, as determined by the associated events */
    addr?: Maybe<Account>
    /** The address of the resolver contract */
    address: Scalars['Bytes']
    /** The set of observed SLIP-44 coin types for this resolver */
    coinTypes?: Maybe<Array<Scalars['BigInt']>>
    /** The content hash for this resolver, in binary format */
    contentHash?: Maybe<Scalars['Bytes']>
    /** The domain that this resolver is associated with */
    domain?: Maybe<Domain>
    /** The events associated with this resolver */
    events: Array<ResolverEvent>
    /** The unique identifier for this resolver, which is a concatenation of the resolver address and the domain namehash */
    id: Scalars['ID']
    /** The set of observed text record keys for this resolver */
    texts?: Maybe<Array<Scalars['String']>>
}

export type ResolverEventsArgs = {
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<ResolverEvent_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    where?: InputMaybe<ResolverEvent_Filter>
}

export type ResolverEvent = {
    /** The block number that the event occurred on */
    blockNumber: Scalars['Int']
    /** Concatenation of block number and log ID */
    id: Scalars['ID']
    /** Used to derive relationships to Resolvers */
    resolver: Resolver
    /** The transaction hash of the event */
    transactionID: Scalars['Bytes']
}

export type ResolverEvent_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<ResolverEvent_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<ResolverEvent_Filter>>>
    resolver?: InputMaybe<Scalars['String']>
    resolver_?: InputMaybe<Resolver_Filter>
    resolver_contains?: InputMaybe<Scalars['String']>
    resolver_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_ends_with?: InputMaybe<Scalars['String']>
    resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_gt?: InputMaybe<Scalars['String']>
    resolver_gte?: InputMaybe<Scalars['String']>
    resolver_in?: InputMaybe<Array<Scalars['String']>>
    resolver_lt?: InputMaybe<Scalars['String']>
    resolver_lte?: InputMaybe<Scalars['String']>
    resolver_not?: InputMaybe<Scalars['String']>
    resolver_not_contains?: InputMaybe<Scalars['String']>
    resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_not_ends_with?: InputMaybe<Scalars['String']>
    resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_not_in?: InputMaybe<Array<Scalars['String']>>
    resolver_not_starts_with?: InputMaybe<Scalars['String']>
    resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver_starts_with?: InputMaybe<Scalars['String']>
    resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum ResolverEvent_OrderBy {
    BlockNumber = 'blockNumber',
    Id = 'id',
    Resolver = 'resolver',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    TransactionId = 'transactionID'
}

export type Resolver_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    addr?: InputMaybe<Scalars['String']>
    addr_?: InputMaybe<Account_Filter>
    addr_contains?: InputMaybe<Scalars['String']>
    addr_contains_nocase?: InputMaybe<Scalars['String']>
    addr_ends_with?: InputMaybe<Scalars['String']>
    addr_ends_with_nocase?: InputMaybe<Scalars['String']>
    addr_gt?: InputMaybe<Scalars['String']>
    addr_gte?: InputMaybe<Scalars['String']>
    addr_in?: InputMaybe<Array<Scalars['String']>>
    addr_lt?: InputMaybe<Scalars['String']>
    addr_lte?: InputMaybe<Scalars['String']>
    addr_not?: InputMaybe<Scalars['String']>
    addr_not_contains?: InputMaybe<Scalars['String']>
    addr_not_contains_nocase?: InputMaybe<Scalars['String']>
    addr_not_ends_with?: InputMaybe<Scalars['String']>
    addr_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    addr_not_in?: InputMaybe<Array<Scalars['String']>>
    addr_not_starts_with?: InputMaybe<Scalars['String']>
    addr_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    addr_starts_with?: InputMaybe<Scalars['String']>
    addr_starts_with_nocase?: InputMaybe<Scalars['String']>
    address?: InputMaybe<Scalars['Bytes']>
    address_contains?: InputMaybe<Scalars['Bytes']>
    address_gt?: InputMaybe<Scalars['Bytes']>
    address_gte?: InputMaybe<Scalars['Bytes']>
    address_in?: InputMaybe<Array<Scalars['Bytes']>>
    address_lt?: InputMaybe<Scalars['Bytes']>
    address_lte?: InputMaybe<Scalars['Bytes']>
    address_not?: InputMaybe<Scalars['Bytes']>
    address_not_contains?: InputMaybe<Scalars['Bytes']>
    address_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    and?: InputMaybe<Array<InputMaybe<Resolver_Filter>>>
    coinTypes?: InputMaybe<Array<Scalars['BigInt']>>
    coinTypes_contains?: InputMaybe<Array<Scalars['BigInt']>>
    coinTypes_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>
    coinTypes_not?: InputMaybe<Array<Scalars['BigInt']>>
    coinTypes_not_contains?: InputMaybe<Array<Scalars['BigInt']>>
    coinTypes_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>
    contentHash?: InputMaybe<Scalars['Bytes']>
    contentHash_contains?: InputMaybe<Scalars['Bytes']>
    contentHash_gt?: InputMaybe<Scalars['Bytes']>
    contentHash_gte?: InputMaybe<Scalars['Bytes']>
    contentHash_in?: InputMaybe<Array<Scalars['Bytes']>>
    contentHash_lt?: InputMaybe<Scalars['Bytes']>
    contentHash_lte?: InputMaybe<Scalars['Bytes']>
    contentHash_not?: InputMaybe<Scalars['Bytes']>
    contentHash_not_contains?: InputMaybe<Scalars['Bytes']>
    contentHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    domain?: InputMaybe<Scalars['String']>
    domain_?: InputMaybe<Domain_Filter>
    domain_contains?: InputMaybe<Scalars['String']>
    domain_contains_nocase?: InputMaybe<Scalars['String']>
    domain_ends_with?: InputMaybe<Scalars['String']>
    domain_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_gt?: InputMaybe<Scalars['String']>
    domain_gte?: InputMaybe<Scalars['String']>
    domain_in?: InputMaybe<Array<Scalars['String']>>
    domain_lt?: InputMaybe<Scalars['String']>
    domain_lte?: InputMaybe<Scalars['String']>
    domain_not?: InputMaybe<Scalars['String']>
    domain_not_contains?: InputMaybe<Scalars['String']>
    domain_not_contains_nocase?: InputMaybe<Scalars['String']>
    domain_not_ends_with?: InputMaybe<Scalars['String']>
    domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_not_in?: InputMaybe<Array<Scalars['String']>>
    domain_not_starts_with?: InputMaybe<Scalars['String']>
    domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    domain_starts_with?: InputMaybe<Scalars['String']>
    domain_starts_with_nocase?: InputMaybe<Scalars['String']>
    events_?: InputMaybe<ResolverEvent_Filter>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<Resolver_Filter>>>
    texts?: InputMaybe<Array<Scalars['String']>>
    texts_contains?: InputMaybe<Array<Scalars['String']>>
    texts_contains_nocase?: InputMaybe<Array<Scalars['String']>>
    texts_not?: InputMaybe<Array<Scalars['String']>>
    texts_not_contains?: InputMaybe<Array<Scalars['String']>>
    texts_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>
}

export enum Resolver_OrderBy {
    Addr = 'addr',
    AddrId = 'addr__id',
    Address = 'address',
    CoinTypes = 'coinTypes',
    ContentHash = 'contentHash',
    Domain = 'domain',
    DomainCreatedAt = 'domain__createdAt',
    DomainExpiryDate = 'domain__expiryDate',
    DomainId = 'domain__id',
    DomainIsMigrated = 'domain__isMigrated',
    DomainLabelName = 'domain__labelName',
    DomainLabelhash = 'domain__labelhash',
    DomainName = 'domain__name',
    DomainSubdomainCount = 'domain__subdomainCount',
    DomainTtl = 'domain__ttl',
    Events = 'events',
    Id = 'id',
    Texts = 'texts'
}

export type RespCollection = {
    __typename?: 'RespCollection'
    banner_image_url?: Maybe<Scalars['String']>
    collection_id?: Maybe<Scalars['String']>
    description?: Maybe<Scalars['String']>
    discord_url?: Maybe<Scalars['String']>
    distinct_nft_count?: Maybe<Scalars['Int']>
    distinct_owner_count?: Maybe<Scalars['Int']>
    external_url?: Maybe<Scalars['String']>
    floor_prices: Array<RespNftFloorPrice>
    image_url?: Maybe<Scalars['String']>
    marketplace_pages?: Maybe<Array<RespMarketplace>>
    metaplex_first_verified_creator?: Maybe<Scalars['String']>
    metaplex_mint?: Maybe<Scalars['String']>
    name?: Maybe<Scalars['String']>
    spam_score?: Maybe<Scalars['String']>
    twitter_username?: Maybe<Scalars['String']>
}

export type RespCollections = {
    __typename?: 'RespCollections'
    collections: Array<RespCollection>
    nextKey?: Maybe<Scalars['String']>
}

export type RespContract = {
    __typename?: 'RespContract'
    name?: Maybe<Scalars['String']>
    symbol?: Maybe<Scalars['String']>
    type: Scalars['String']
}

export type RespMarketplace = {
    __typename?: 'RespMarketplace'
    collection_url: Scalars['String']
    marketplace_collection_id: Scalars['String']
    marketplace_id: Scalars['String']
    marketplace_name: Scalars['String']
    nft_url: Scalars['String']
    verified?: Maybe<Scalars['Boolean']>
}

export type RespNft = {
    __typename?: 'RespNFT'
    audio_url?: Maybe<Scalars['String']>
    background_color?: Maybe<Scalars['String']>
    chain: Scalars['String']
    collection?: Maybe<RespCollection>
    contract?: Maybe<RespContract>
    contract_address: Scalars['String']
    created_date?: Maybe<Scalars['String']>
    description?: Maybe<Scalars['String']>
    external_url?: Maybe<Scalars['String']>
    extra_metadata?: Maybe<RespNftMeta>
    image_url?: Maybe<Scalars['String']>
    model_url?: Maybe<Scalars['String']>
    name?: Maybe<Scalars['String']>
    nft_id: Scalars['String']
    owner_count?: Maybe<Scalars['Int']>
    owners: Array<RespNftOwner>
    previews: RespNftPreviews
    status: Scalars['String']
    token_count?: Maybe<Scalars['Int']>
    token_id?: Maybe<Scalars['String']>
    video_url?: Maybe<Scalars['String']>
}

export type RespNftFloorPrice = {
    __typename?: 'RespNftFloorPrice'
    marketplace_id?: Maybe<Scalars['String']>
    payment_token: RespPaymentToken
    value?: Maybe<Scalars['Int']>
}

export type RespNftMeta = {
    __typename?: 'RespNftMeta'
    animation_original_url?: Maybe<Scalars['String']>
    attributes: Array<RespNftTrait>
    image_original_url?: Maybe<Scalars['String']>
    metadata_original_url?: Maybe<Scalars['String']>
}

export type RespNftOwner = {
    __typename?: 'RespNftOwner'
    first_acquired_date: Scalars['String']
    last_acquired_date: Scalars['String']
    owner_address: Scalars['String']
    quantity: Scalars['Int']
}

export type RespNftPreviews = {
    __typename?: 'RespNftPreviews'
    blurhash?: Maybe<Scalars['String']>
    image_large_url?: Maybe<Scalars['String']>
    image_medium_url?: Maybe<Scalars['String']>
    image_opengraph_url?: Maybe<Scalars['String']>
    image_small_url?: Maybe<Scalars['String']>
}

export type RespNftTrait = {
    __typename?: 'RespNftTrait'
    trait_type: Scalars['String']
    value: Scalars['String']
}

export type RespPaymentToken = {
    __typename?: 'RespPaymentToken'
    address?: Maybe<Scalars['String']>
    decimals: Scalars['Int']
    name?: Maybe<Scalars['String']>
    payment_token_id: Scalars['String']
    symbol?: Maybe<Scalars['String']>
}

export type RespTokens = {
    __typename?: 'RespTokens'
    nfts?: Maybe<Array<RespNft>>
}

export type StateDiffChange = {
    __typename?: 'StateDiffChange'
    from?: Maybe<BalanceDiff>
    to: BalanceDiff
}

export type Subscription = {
    __typename?: 'Subscription'
    /** Access to subgraph metadata */
    _meta?: Maybe<_Meta_>
    abiChanged?: Maybe<AbiChanged>
    abiChangeds: Array<AbiChanged>
    account?: Maybe<Account>
    accounts: Array<Account>
    addrChanged?: Maybe<AddrChanged>
    addrChangeds: Array<AddrChanged>
    addressEvent: AddressEvent
    authorisationChanged?: Maybe<AuthorisationChanged>
    authorisationChangeds: Array<AuthorisationChanged>
    contenthashChanged?: Maybe<ContenthashChanged>
    contenthashChangeds: Array<ContenthashChanged>
    domain?: Maybe<Domain>
    domainEvent?: Maybe<DomainEvent>
    domainEvents: Array<DomainEvent>
    domains: Array<Domain>
    expiryExtended?: Maybe<ExpiryExtended>
    expiryExtendeds: Array<ExpiryExtended>
    fusesSet?: Maybe<FusesSet>
    fusesSets: Array<FusesSet>
    interfaceChanged?: Maybe<InterfaceChanged>
    interfaceChangeds: Array<InterfaceChanged>
    minedTransaction: MinedTransfer
    multicoinAddrChanged?: Maybe<MulticoinAddrChanged>
    multicoinAddrChangeds: Array<MulticoinAddrChanged>
    nameChanged?: Maybe<NameChanged>
    nameChangeds: Array<NameChanged>
    nameRegistered?: Maybe<NameRegistered>
    nameRegistereds: Array<NameRegistered>
    nameRenewed?: Maybe<NameRenewed>
    nameReneweds: Array<NameRenewed>
    nameTransferred?: Maybe<NameTransferred>
    nameTransferreds: Array<NameTransferred>
    nameUnwrapped?: Maybe<NameUnwrapped>
    nameUnwrappeds: Array<NameUnwrapped>
    nameWrapped?: Maybe<NameWrapped>
    nameWrappeds: Array<NameWrapped>
    newBlockFeed: BlockSummary
    newOwner?: Maybe<NewOwner>
    newOwners: Array<NewOwner>
    newResolver?: Maybe<NewResolver>
    newResolvers: Array<NewResolver>
    newTTL?: Maybe<NewTtl>
    newTTLs: Array<NewTtl>
    /** A blocks transfers of a given type have finished being processed */
    newTransfersCompleteFeed: TransferComplete
    pendingTransaction: PendingTransfer
    pubkeyChanged?: Maybe<PubkeyChanged>
    pubkeyChangeds: Array<PubkeyChanged>
    registration?: Maybe<Registration>
    registrationEvent?: Maybe<RegistrationEvent>
    registrationEvents: Array<RegistrationEvent>
    registrations: Array<Registration>
    resolver?: Maybe<Resolver>
    resolverEvent?: Maybe<ResolverEvent>
    resolverEvents: Array<ResolverEvent>
    resolvers: Array<Resolver>
    textChanged?: Maybe<TextChanged>
    textChangeds: Array<TextChanged>
    timeseriesEvent: TimeseriesEvent
    tokenMarketMoversProcessedEvent: TokenMarketMoverProcessedEventResult
    transactionEvent: Scalars['String']
    transfer?: Maybe<Transfer>
    transfers: Array<Transfer>
    versionChanged?: Maybe<VersionChanged>
    versionChangeds: Array<VersionChanged>
    wrappedDomain?: Maybe<WrappedDomain>
    wrappedDomains: Array<WrappedDomain>
    wrappedTransfer?: Maybe<WrappedTransfer>
    wrappedTransfers: Array<WrappedTransfer>
}

export type Subscription_MetaArgs = {
    block?: InputMaybe<Block_Height>
}

export type SubscriptionAbiChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionAbiChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<AbiChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<AbiChanged_Filter>
}

export type SubscriptionAccountArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionAccountsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<Account_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<Account_Filter>
}

export type SubscriptionAddrChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionAddrChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<AddrChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<AddrChanged_Filter>
}

export type SubscriptionAddressEventArgs = {
    event?: InputMaybe<AddressEventType>
    owner: Scalars['String']
}

export type SubscriptionAuthorisationChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionAuthorisationChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<AuthorisationChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<AuthorisationChanged_Filter>
}

export type SubscriptionContenthashChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionContenthashChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<ContenthashChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<ContenthashChanged_Filter>
}

export type SubscriptionDomainArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionDomainEventArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionDomainEventsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<DomainEvent_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<DomainEvent_Filter>
}

export type SubscriptionDomainsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<Domain_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<Domain_Filter>
}

export type SubscriptionExpiryExtendedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionExpiryExtendedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<ExpiryExtended_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<ExpiryExtended_Filter>
}

export type SubscriptionFusesSetArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionFusesSetsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<FusesSet_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<FusesSet_Filter>
}

export type SubscriptionInterfaceChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionInterfaceChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<InterfaceChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<InterfaceChanged_Filter>
}

export type SubscriptionMinedTransactionArgs = {
    owner?: InputMaybe<Scalars['String']>
}

export type SubscriptionMulticoinAddrChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionMulticoinAddrChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<MulticoinAddrChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<MulticoinAddrChanged_Filter>
}

export type SubscriptionNameChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionNameChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NameChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NameChanged_Filter>
}

export type SubscriptionNameRegisteredArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionNameRegisteredsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NameRegistered_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NameRegistered_Filter>
}

export type SubscriptionNameRenewedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionNameRenewedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NameRenewed_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NameRenewed_Filter>
}

export type SubscriptionNameTransferredArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionNameTransferredsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NameTransferred_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NameTransferred_Filter>
}

export type SubscriptionNameUnwrappedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionNameUnwrappedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NameUnwrapped_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NameUnwrapped_Filter>
}

export type SubscriptionNameWrappedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionNameWrappedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NameWrapped_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NameWrapped_Filter>
}

export type SubscriptionNewOwnerArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionNewOwnersArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NewOwner_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NewOwner_Filter>
}

export type SubscriptionNewResolverArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionNewResolversArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NewResolver_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NewResolver_Filter>
}

export type SubscriptionNewTtlArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionNewTtLsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<NewTtl_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<NewTtl_Filter>
}

export type SubscriptionPendingTransactionArgs = {
    owner?: InputMaybe<Scalars['String']>
}

export type SubscriptionPubkeyChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionPubkeyChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<PubkeyChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<PubkeyChanged_Filter>
}

export type SubscriptionRegistrationArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionRegistrationEventArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionRegistrationEventsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<RegistrationEvent_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<RegistrationEvent_Filter>
}

export type SubscriptionRegistrationsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<Registration_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<Registration_Filter>
}

export type SubscriptionResolverArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionResolverEventArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionResolverEventsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<ResolverEvent_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<ResolverEvent_Filter>
}

export type SubscriptionResolversArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<Resolver_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<Resolver_Filter>
}

export type SubscriptionTextChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionTextChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<TextChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<TextChanged_Filter>
}

export type SubscriptionTimeseriesEventArgs = {
    key: Scalars['String']
    scale: TimeseriesScale
}

export type SubscriptionTransactionEventArgs = {
    hash: Scalars['String']
}

export type SubscriptionTransferArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionTransfersArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<Transfer_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<Transfer_Filter>
}

export type SubscriptionVersionChangedArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionVersionChangedsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<VersionChanged_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<VersionChanged_Filter>
}

export type SubscriptionWrappedDomainArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionWrappedDomainsArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<WrappedDomain_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<WrappedDomain_Filter>
}

export type SubscriptionWrappedTransferArgs = {
    block?: InputMaybe<Block_Height>
    id: Scalars['ID']
    subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionWrappedTransfersArgs = {
    block?: InputMaybe<Block_Height>
    first?: InputMaybe<Scalars['Int']>
    orderBy?: InputMaybe<WrappedTransfer_OrderBy>
    orderDirection?: InputMaybe<OrderDirection>
    skip?: InputMaybe<Scalars['Int']>
    subgraphError?: _SubgraphErrorPolicy_
    where?: InputMaybe<WrappedTransfer_Filter>
}

export type TextChanged = ResolverEvent & {
    __typename?: 'TextChanged'
    /** Block number of the Ethereum block in which the event occurred */
    blockNumber: Scalars['Int']
    /** Concatenation of block number and log ID */
    id: Scalars['ID']
    /** The key of the text record that was changed */
    key: Scalars['String']
    /** Used to derive relationships to Resolvers */
    resolver: Resolver
    /** Hash of the Ethereum transaction in which the event occurred */
    transactionID: Scalars['Bytes']
    /** The new value of the text record that was changed */
    value?: Maybe<Scalars['String']>
}

export type TextChanged_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<TextChanged_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    key?: InputMaybe<Scalars['String']>
    key_contains?: InputMaybe<Scalars['String']>
    key_contains_nocase?: InputMaybe<Scalars['String']>
    key_ends_with?: InputMaybe<Scalars['String']>
    key_ends_with_nocase?: InputMaybe<Scalars['String']>
    key_gt?: InputMaybe<Scalars['String']>
    key_gte?: InputMaybe<Scalars['String']>
    key_in?: InputMaybe<Array<Scalars['String']>>
    key_lt?: InputMaybe<Scalars['String']>
    key_lte?: InputMaybe<Scalars['String']>
    key_not?: InputMaybe<Scalars['String']>
    key_not_contains?: InputMaybe<Scalars['String']>
    key_not_contains_nocase?: InputMaybe<Scalars['String']>
    key_not_ends_with?: InputMaybe<Scalars['String']>
    key_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    key_not_in?: InputMaybe<Array<Scalars['String']>>
    key_not_starts_with?: InputMaybe<Scalars['String']>
    key_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    key_starts_with?: InputMaybe<Scalars['String']>
    key_starts_with_nocase?: InputMaybe<Scalars['String']>
    or?: InputMaybe<Array<InputMaybe<TextChanged_Filter>>>
    resolver?: InputMaybe<Scalars['String']>
    resolver_?: InputMaybe<Resolver_Filter>
    resolver_contains?: InputMaybe<Scalars['String']>
    resolver_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_ends_with?: InputMaybe<Scalars['String']>
    resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_gt?: InputMaybe<Scalars['String']>
    resolver_gte?: InputMaybe<Scalars['String']>
    resolver_in?: InputMaybe<Array<Scalars['String']>>
    resolver_lt?: InputMaybe<Scalars['String']>
    resolver_lte?: InputMaybe<Scalars['String']>
    resolver_not?: InputMaybe<Scalars['String']>
    resolver_not_contains?: InputMaybe<Scalars['String']>
    resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_not_ends_with?: InputMaybe<Scalars['String']>
    resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_not_in?: InputMaybe<Array<Scalars['String']>>
    resolver_not_starts_with?: InputMaybe<Scalars['String']>
    resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver_starts_with?: InputMaybe<Scalars['String']>
    resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    value?: InputMaybe<Scalars['String']>
    value_contains?: InputMaybe<Scalars['String']>
    value_contains_nocase?: InputMaybe<Scalars['String']>
    value_ends_with?: InputMaybe<Scalars['String']>
    value_ends_with_nocase?: InputMaybe<Scalars['String']>
    value_gt?: InputMaybe<Scalars['String']>
    value_gte?: InputMaybe<Scalars['String']>
    value_in?: InputMaybe<Array<Scalars['String']>>
    value_lt?: InputMaybe<Scalars['String']>
    value_lte?: InputMaybe<Scalars['String']>
    value_not?: InputMaybe<Scalars['String']>
    value_not_contains?: InputMaybe<Scalars['String']>
    value_not_contains_nocase?: InputMaybe<Scalars['String']>
    value_not_ends_with?: InputMaybe<Scalars['String']>
    value_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    value_not_in?: InputMaybe<Array<Scalars['String']>>
    value_not_starts_with?: InputMaybe<Scalars['String']>
    value_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    value_starts_with?: InputMaybe<Scalars['String']>
    value_starts_with_nocase?: InputMaybe<Scalars['String']>
}

export enum TextChanged_OrderBy {
    BlockNumber = 'blockNumber',
    Id = 'id',
    Key = 'key',
    Resolver = 'resolver',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    TransactionId = 'transactionID',
    Value = 'value'
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

export type TokenMarketMoverProcessedEventResult = {
    __typename?: 'TokenMarketMoverProcessedEventResult'
    _?: Maybe<Scalars['String']>
}

export enum TokenMarketMoverSortDirection {
    Asc = 'Asc',
    Desc = 'Desc'
}

export enum TokenMarketMoverType {
    Ath = 'ATH',
    '1H' = '_1H',
    '5M' = '_5M',
    '7D' = '_7D',
    '24H' = '_24H',
    '30D' = '_30D'
}

export type TokenMarketMoversItem = {
    __typename?: 'TokenMarketMoversItem'
    ath?: Maybe<Scalars['Float']>
    coingeckoCoinId: Scalars['String']
    contractAddress?: Maybe<Scalars['EthVMPrefixedEthereumAddress']>
    decimals?: Maybe<Scalars['Int']>
    eventTimestampIso8601: Scalars['EthVMIso8601DateTimeMilliseconds']
    eventTimestampUnixSec: Scalars['EthVMUnixEpochSeconds']
    icon?: Maybe<Scalars['EthVMUrl']>
    iconPng?: Maybe<Scalars['EthVMUrl']>
    marketDataLastUpdatedAtIso8601: Scalars['EthVMIso8601DateTimeMilliseconds']
    marketDataLastUpdatedAtUnixSec: Scalars['EthVMUnixEpochSeconds']
    name: Scalars['String']
    price?: Maybe<Scalars['EthVMCurrencyFloat']>
    priceChangePercentage?: Maybe<Scalars['Float']>
    symbol: Scalars['String']
    type: TokenMarketMoverType
    website?: Maybe<Scalars['EthVMUrl']>
}

export type TokenSearch = {
    __typename?: 'TokenSearch'
    contract: Scalars['String']
    keyword: Scalars['String']
}

export enum TokenType {
    Erc20 = 'ERC20',
    Erc721 = 'ERC721',
    Erc1155 = 'ERC1155'
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

export type TransactionAccessListItem = {
    address: Scalars['String']
    storageKeys: Array<Scalars['String']>
}

export type TransactionStateDiffChange = {
    __typename?: 'TransactionStateDiffChange'
    from?: Maybe<BalanceDiff>
    to: BalanceDiff
}

export type Transfer = DomainEvent & {
    __typename?: 'Transfer'
    block: Scalars['Int']
    /** The block number at which the event occurred */
    blockNumber: Scalars['Int']
    /** The domain name associated with the event */
    domain: Domain
    from: Scalars['String']
    /** The unique identifier of the event */
    id: Scalars['ID']
    /** The account that owns the domain after the transfer */
    owner: Account
    status?: Maybe<Scalars['Boolean']>
    subtype: TransferSubtype
    timestamp: Scalars['Int']
    to: Scalars['String']
    transactionHash: Scalars['String']
    /** The transaction hash of the transaction that triggered the event */
    transactionID: Scalars['Bytes']
    txFee: Scalars['String']
    type: TransferType
    validatorIndex?: Maybe<Scalars['String']>
    withdrawalIndex?: Maybe<Scalars['String']>
}

export type TransferComplete = {
    __typename?: 'TransferComplete'
    block: Scalars['Int']
    type: TransferType
}

export enum TransferDirection {
    Incoming = 'INCOMING',
    Outgoing = 'OUTGOING'
}

export enum TransferSubtype {
    BlockReward = 'BlockReward',
    ContractDestroyed = 'ContractDestroyed',
    DaoHardFork = 'DaoHardFork',
    Erc20 = 'ERC20',
    Erc721 = 'ERC721',
    Erc1155 = 'ERC1155',
    Genesis = 'Genesis',
    InternalTransaction = 'InternalTransaction',
    Transaction = 'Transaction',
    UncleReward = 'UncleReward',
    Unknown = 'Unknown',
    Withdrawl = 'Withdrawl'
}

export enum TransferType {
    Erc20 = 'ERC20',
    Erc721 = 'ERC721',
    Erc1155 = 'ERC1155',
    Eth = 'ETH'
}

export type TransferWithError = {
    __typename?: 'TransferWithError'
    block: Scalars['Int']
    from: Scalars['String']
    nonce?: Maybe<Scalars['Int']>
    status: Scalars['Boolean']
    subtype: TransferSubtype
    timestamp: Scalars['Int']
    to: Scalars['String']
    transactionError?: Maybe<Scalars['String']>
    transactionHash: Scalars['String']
    transactionInput?: Maybe<Scalars['String']>
    transferError?: Maybe<Scalars['String']>
    txFee: Scalars['String']
    type: TransferType
    validatorIndex?: Maybe<Scalars['String']>
    withdrawalIndex?: Maybe<Scalars['String']>
}

export type Transfer_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<Transfer_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    domain?: InputMaybe<Scalars['String']>
    domain_?: InputMaybe<Domain_Filter>
    domain_contains?: InputMaybe<Scalars['String']>
    domain_contains_nocase?: InputMaybe<Scalars['String']>
    domain_ends_with?: InputMaybe<Scalars['String']>
    domain_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_gt?: InputMaybe<Scalars['String']>
    domain_gte?: InputMaybe<Scalars['String']>
    domain_in?: InputMaybe<Array<Scalars['String']>>
    domain_lt?: InputMaybe<Scalars['String']>
    domain_lte?: InputMaybe<Scalars['String']>
    domain_not?: InputMaybe<Scalars['String']>
    domain_not_contains?: InputMaybe<Scalars['String']>
    domain_not_contains_nocase?: InputMaybe<Scalars['String']>
    domain_not_ends_with?: InputMaybe<Scalars['String']>
    domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_not_in?: InputMaybe<Array<Scalars['String']>>
    domain_not_starts_with?: InputMaybe<Scalars['String']>
    domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    domain_starts_with?: InputMaybe<Scalars['String']>
    domain_starts_with_nocase?: InputMaybe<Scalars['String']>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<Transfer_Filter>>>
    owner?: InputMaybe<Scalars['String']>
    owner_?: InputMaybe<Account_Filter>
    owner_contains?: InputMaybe<Scalars['String']>
    owner_contains_nocase?: InputMaybe<Scalars['String']>
    owner_ends_with?: InputMaybe<Scalars['String']>
    owner_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_gt?: InputMaybe<Scalars['String']>
    owner_gte?: InputMaybe<Scalars['String']>
    owner_in?: InputMaybe<Array<Scalars['String']>>
    owner_lt?: InputMaybe<Scalars['String']>
    owner_lte?: InputMaybe<Scalars['String']>
    owner_not?: InputMaybe<Scalars['String']>
    owner_not_contains?: InputMaybe<Scalars['String']>
    owner_not_contains_nocase?: InputMaybe<Scalars['String']>
    owner_not_ends_with?: InputMaybe<Scalars['String']>
    owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_not_in?: InputMaybe<Array<Scalars['String']>>
    owner_not_starts_with?: InputMaybe<Scalars['String']>
    owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    owner_starts_with?: InputMaybe<Scalars['String']>
    owner_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum Transfer_OrderBy {
    BlockNumber = 'blockNumber',
    Domain = 'domain',
    DomainCreatedAt = 'domain__createdAt',
    DomainExpiryDate = 'domain__expiryDate',
    DomainId = 'domain__id',
    DomainIsMigrated = 'domain__isMigrated',
    DomainLabelName = 'domain__labelName',
    DomainLabelhash = 'domain__labelhash',
    DomainName = 'domain__name',
    DomainSubdomainCount = 'domain__subdomainCount',
    DomainTtl = 'domain__ttl',
    Id = 'id',
    Owner = 'owner',
    OwnerId = 'owner__id',
    TransactionId = 'transactionID'
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
    /**
     * Is/was this transaction calling a contract to execute?
     *
     * Null for pending transactions since they haven't executed yet
     *
     * Determined by whether the "gasUsed" indicates contract execution
     */
    isContractCall?: Maybe<Scalars['Boolean']>
    logs: Array<Log>
    maxFeePerGas?: Maybe<Scalars['String']>
    maxPriorityFeePerGas?: Maybe<Scalars['String']>
    nonce: Scalars['Int']
    r?: Maybe<Scalars['String']>
    replacedBy?: Maybe<Scalars['String']>
    s?: Maybe<Scalars['String']>
    status?: Maybe<Scalars['String']>
    timestamp?: Maybe<Scalars['Int']>
    to?: Maybe<Scalars['String']>
    trace?: Maybe<Array<Trace>>
    transactionIndex?: Maybe<Scalars['Int']>
    v?: Maybe<Scalars['String']>
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

export type VersionChanged = ResolverEvent & {
    __typename?: 'VersionChanged'
    /** The block number at which the event occurred */
    blockNumber: Scalars['Int']
    /** Unique identifier for this event */
    id: Scalars['ID']
    /** The resolver associated with this event */
    resolver: Resolver
    /** The transaction hash associated with the event */
    transactionID: Scalars['Bytes']
    /** The new version number of the resolver */
    version: Scalars['BigInt']
}

export type VersionChanged_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<VersionChanged_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<VersionChanged_Filter>>>
    resolver?: InputMaybe<Scalars['String']>
    resolver_?: InputMaybe<Resolver_Filter>
    resolver_contains?: InputMaybe<Scalars['String']>
    resolver_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_ends_with?: InputMaybe<Scalars['String']>
    resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_gt?: InputMaybe<Scalars['String']>
    resolver_gte?: InputMaybe<Scalars['String']>
    resolver_in?: InputMaybe<Array<Scalars['String']>>
    resolver_lt?: InputMaybe<Scalars['String']>
    resolver_lte?: InputMaybe<Scalars['String']>
    resolver_not?: InputMaybe<Scalars['String']>
    resolver_not_contains?: InputMaybe<Scalars['String']>
    resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
    resolver_not_ends_with?: InputMaybe<Scalars['String']>
    resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    resolver_not_in?: InputMaybe<Array<Scalars['String']>>
    resolver_not_starts_with?: InputMaybe<Scalars['String']>
    resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    resolver_starts_with?: InputMaybe<Scalars['String']>
    resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
    version?: InputMaybe<Scalars['BigInt']>
    version_gt?: InputMaybe<Scalars['BigInt']>
    version_gte?: InputMaybe<Scalars['BigInt']>
    version_in?: InputMaybe<Array<Scalars['BigInt']>>
    version_lt?: InputMaybe<Scalars['BigInt']>
    version_lte?: InputMaybe<Scalars['BigInt']>
    version_not?: InputMaybe<Scalars['BigInt']>
    version_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export enum VersionChanged_OrderBy {
    BlockNumber = 'blockNumber',
    Id = 'id',
    Resolver = 'resolver',
    ResolverAddress = 'resolver__address',
    ResolverContentHash = 'resolver__contentHash',
    ResolverId = 'resolver__id',
    TransactionId = 'transactionID',
    Version = 'version'
}

export type WrappedDomain = {
    __typename?: 'WrappedDomain'
    /** The domain that is wrapped by this WrappedDomain */
    domain: Domain
    /** The expiry date of the wrapped domain */
    expiryDate: Scalars['BigInt']
    /** The number of fuses remaining on the wrapped domain */
    fuses: Scalars['Int']
    /** unique identifier for each instance of the WrappedDomain entity */
    id: Scalars['ID']
    /** The name of the wrapped domain */
    name?: Maybe<Scalars['String']>
    /** The account that owns this WrappedDomain */
    owner: Account
}

export type WrappedDomain_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<WrappedDomain_Filter>>>
    domain?: InputMaybe<Scalars['String']>
    domain_?: InputMaybe<Domain_Filter>
    domain_contains?: InputMaybe<Scalars['String']>
    domain_contains_nocase?: InputMaybe<Scalars['String']>
    domain_ends_with?: InputMaybe<Scalars['String']>
    domain_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_gt?: InputMaybe<Scalars['String']>
    domain_gte?: InputMaybe<Scalars['String']>
    domain_in?: InputMaybe<Array<Scalars['String']>>
    domain_lt?: InputMaybe<Scalars['String']>
    domain_lte?: InputMaybe<Scalars['String']>
    domain_not?: InputMaybe<Scalars['String']>
    domain_not_contains?: InputMaybe<Scalars['String']>
    domain_not_contains_nocase?: InputMaybe<Scalars['String']>
    domain_not_ends_with?: InputMaybe<Scalars['String']>
    domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_not_in?: InputMaybe<Array<Scalars['String']>>
    domain_not_starts_with?: InputMaybe<Scalars['String']>
    domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    domain_starts_with?: InputMaybe<Scalars['String']>
    domain_starts_with_nocase?: InputMaybe<Scalars['String']>
    expiryDate?: InputMaybe<Scalars['BigInt']>
    expiryDate_gt?: InputMaybe<Scalars['BigInt']>
    expiryDate_gte?: InputMaybe<Scalars['BigInt']>
    expiryDate_in?: InputMaybe<Array<Scalars['BigInt']>>
    expiryDate_lt?: InputMaybe<Scalars['BigInt']>
    expiryDate_lte?: InputMaybe<Scalars['BigInt']>
    expiryDate_not?: InputMaybe<Scalars['BigInt']>
    expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>
    fuses?: InputMaybe<Scalars['Int']>
    fuses_gt?: InputMaybe<Scalars['Int']>
    fuses_gte?: InputMaybe<Scalars['Int']>
    fuses_in?: InputMaybe<Array<Scalars['Int']>>
    fuses_lt?: InputMaybe<Scalars['Int']>
    fuses_lte?: InputMaybe<Scalars['Int']>
    fuses_not?: InputMaybe<Scalars['Int']>
    fuses_not_in?: InputMaybe<Array<Scalars['Int']>>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    name?: InputMaybe<Scalars['String']>
    name_contains?: InputMaybe<Scalars['String']>
    name_contains_nocase?: InputMaybe<Scalars['String']>
    name_ends_with?: InputMaybe<Scalars['String']>
    name_ends_with_nocase?: InputMaybe<Scalars['String']>
    name_gt?: InputMaybe<Scalars['String']>
    name_gte?: InputMaybe<Scalars['String']>
    name_in?: InputMaybe<Array<Scalars['String']>>
    name_lt?: InputMaybe<Scalars['String']>
    name_lte?: InputMaybe<Scalars['String']>
    name_not?: InputMaybe<Scalars['String']>
    name_not_contains?: InputMaybe<Scalars['String']>
    name_not_contains_nocase?: InputMaybe<Scalars['String']>
    name_not_ends_with?: InputMaybe<Scalars['String']>
    name_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    name_not_in?: InputMaybe<Array<Scalars['String']>>
    name_not_starts_with?: InputMaybe<Scalars['String']>
    name_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    name_starts_with?: InputMaybe<Scalars['String']>
    name_starts_with_nocase?: InputMaybe<Scalars['String']>
    or?: InputMaybe<Array<InputMaybe<WrappedDomain_Filter>>>
    owner?: InputMaybe<Scalars['String']>
    owner_?: InputMaybe<Account_Filter>
    owner_contains?: InputMaybe<Scalars['String']>
    owner_contains_nocase?: InputMaybe<Scalars['String']>
    owner_ends_with?: InputMaybe<Scalars['String']>
    owner_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_gt?: InputMaybe<Scalars['String']>
    owner_gte?: InputMaybe<Scalars['String']>
    owner_in?: InputMaybe<Array<Scalars['String']>>
    owner_lt?: InputMaybe<Scalars['String']>
    owner_lte?: InputMaybe<Scalars['String']>
    owner_not?: InputMaybe<Scalars['String']>
    owner_not_contains?: InputMaybe<Scalars['String']>
    owner_not_contains_nocase?: InputMaybe<Scalars['String']>
    owner_not_ends_with?: InputMaybe<Scalars['String']>
    owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_not_in?: InputMaybe<Array<Scalars['String']>>
    owner_not_starts_with?: InputMaybe<Scalars['String']>
    owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    owner_starts_with?: InputMaybe<Scalars['String']>
    owner_starts_with_nocase?: InputMaybe<Scalars['String']>
}

export enum WrappedDomain_OrderBy {
    Domain = 'domain',
    DomainCreatedAt = 'domain__createdAt',
    DomainExpiryDate = 'domain__expiryDate',
    DomainId = 'domain__id',
    DomainIsMigrated = 'domain__isMigrated',
    DomainLabelName = 'domain__labelName',
    DomainLabelhash = 'domain__labelhash',
    DomainName = 'domain__name',
    DomainSubdomainCount = 'domain__subdomainCount',
    DomainTtl = 'domain__ttl',
    ExpiryDate = 'expiryDate',
    Fuses = 'fuses',
    Id = 'id',
    Name = 'name',
    Owner = 'owner',
    OwnerId = 'owner__id'
}

export type WrappedTransfer = DomainEvent & {
    __typename?: 'WrappedTransfer'
    /** The block number at which the event occurred */
    blockNumber: Scalars['Int']
    /** The domain name associated with the event */
    domain: Domain
    /** The unique identifier of the event */
    id: Scalars['ID']
    /** The account that owns the wrapped domain after the transfer */
    owner: Account
    /** The transaction hash of the transaction that triggered the event */
    transactionID: Scalars['Bytes']
}

export type WrappedTransfer_Filter = {
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>
    and?: InputMaybe<Array<InputMaybe<WrappedTransfer_Filter>>>
    blockNumber?: InputMaybe<Scalars['Int']>
    blockNumber_gt?: InputMaybe<Scalars['Int']>
    blockNumber_gte?: InputMaybe<Scalars['Int']>
    blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
    blockNumber_lt?: InputMaybe<Scalars['Int']>
    blockNumber_lte?: InputMaybe<Scalars['Int']>
    blockNumber_not?: InputMaybe<Scalars['Int']>
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
    domain?: InputMaybe<Scalars['String']>
    domain_?: InputMaybe<Domain_Filter>
    domain_contains?: InputMaybe<Scalars['String']>
    domain_contains_nocase?: InputMaybe<Scalars['String']>
    domain_ends_with?: InputMaybe<Scalars['String']>
    domain_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_gt?: InputMaybe<Scalars['String']>
    domain_gte?: InputMaybe<Scalars['String']>
    domain_in?: InputMaybe<Array<Scalars['String']>>
    domain_lt?: InputMaybe<Scalars['String']>
    domain_lte?: InputMaybe<Scalars['String']>
    domain_not?: InputMaybe<Scalars['String']>
    domain_not_contains?: InputMaybe<Scalars['String']>
    domain_not_contains_nocase?: InputMaybe<Scalars['String']>
    domain_not_ends_with?: InputMaybe<Scalars['String']>
    domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    domain_not_in?: InputMaybe<Array<Scalars['String']>>
    domain_not_starts_with?: InputMaybe<Scalars['String']>
    domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    domain_starts_with?: InputMaybe<Scalars['String']>
    domain_starts_with_nocase?: InputMaybe<Scalars['String']>
    id?: InputMaybe<Scalars['ID']>
    id_gt?: InputMaybe<Scalars['ID']>
    id_gte?: InputMaybe<Scalars['ID']>
    id_in?: InputMaybe<Array<Scalars['ID']>>
    id_lt?: InputMaybe<Scalars['ID']>
    id_lte?: InputMaybe<Scalars['ID']>
    id_not?: InputMaybe<Scalars['ID']>
    id_not_in?: InputMaybe<Array<Scalars['ID']>>
    or?: InputMaybe<Array<InputMaybe<WrappedTransfer_Filter>>>
    owner?: InputMaybe<Scalars['String']>
    owner_?: InputMaybe<Account_Filter>
    owner_contains?: InputMaybe<Scalars['String']>
    owner_contains_nocase?: InputMaybe<Scalars['String']>
    owner_ends_with?: InputMaybe<Scalars['String']>
    owner_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_gt?: InputMaybe<Scalars['String']>
    owner_gte?: InputMaybe<Scalars['String']>
    owner_in?: InputMaybe<Array<Scalars['String']>>
    owner_lt?: InputMaybe<Scalars['String']>
    owner_lte?: InputMaybe<Scalars['String']>
    owner_not?: InputMaybe<Scalars['String']>
    owner_not_contains?: InputMaybe<Scalars['String']>
    owner_not_contains_nocase?: InputMaybe<Scalars['String']>
    owner_not_ends_with?: InputMaybe<Scalars['String']>
    owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>
    owner_not_in?: InputMaybe<Array<Scalars['String']>>
    owner_not_starts_with?: InputMaybe<Scalars['String']>
    owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>
    owner_starts_with?: InputMaybe<Scalars['String']>
    owner_starts_with_nocase?: InputMaybe<Scalars['String']>
    transactionID?: InputMaybe<Scalars['Bytes']>
    transactionID_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_gt?: InputMaybe<Scalars['Bytes']>
    transactionID_gte?: InputMaybe<Scalars['Bytes']>
    transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
    transactionID_lt?: InputMaybe<Scalars['Bytes']>
    transactionID_lte?: InputMaybe<Scalars['Bytes']>
    transactionID_not?: InputMaybe<Scalars['Bytes']>
    transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
    transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
}

export enum WrappedTransfer_OrderBy {
    BlockNumber = 'blockNumber',
    Domain = 'domain',
    DomainCreatedAt = 'domain__createdAt',
    DomainExpiryDate = 'domain__expiryDate',
    DomainId = 'domain__id',
    DomainIsMigrated = 'domain__isMigrated',
    DomainLabelName = 'domain__labelName',
    DomainLabelhash = 'domain__labelhash',
    DomainName = 'domain__name',
    DomainSubdomainCount = 'domain__subdomainCount',
    DomainTtl = 'domain__ttl',
    Id = 'id',
    Owner = 'owner',
    OwnerId = 'owner__id',
    TransactionId = 'transactionID'
}

export type _Block_ = {
    __typename?: '_Block_'
    /** The hash of the block */
    hash?: Maybe<Scalars['Bytes']>
    /** The block number */
    number: Scalars['Int']
    /** Integer representation of the timestamp stored in blocks for the chain */
    timestamp?: Maybe<Scalars['Int']>
}

/** The type for the top-level _meta field */
export type _Meta_ = {
    __typename?: '_Meta_'
    /**
     * Information about a specific subgraph block. The hash of the block
     * will be null if the _meta field has a block constraint that asks for
     * a block number. It will be filled if the _meta field has no block constraint
     * and therefore asks for the latest  block
     *
     */
    block: _Block_
    /** The deployment ID */
    deployment: Scalars['String']
    /** If `true`, the subgraph encountered indexing errors at some past block */
    hasIndexingErrors: Scalars['Boolean']
}

export enum _SubgraphErrorPolicy_ {
    /** Data will be returned even if the subgraph has indexing errors */
    Allow = 'allow',
    /** If the subgraph has indexing errors, data will be omitted. The default. */
    Deny = 'deny'
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

export type GetEthBalanceQueryVariables = Exact<{
    hash: Scalars['String']
}>

export type GetEthBalanceQuery = { __typename?: 'Query'; getEthBalance: { __typename?: 'EthOwner'; balance: string; owner: string } }

export type MarketDataFragment = {
    __typename?: 'TokenMarketInfo'
    id: string
    symbol: string
    name: string
    image: string
    contract?: string | null
    current_price?: number | null
    market_cap?: number | null
    total_volume?: number | null
    total_supply?: string | null
    price_change_percentage_24h?: number | null
    circulating_supply?: number | null
    high_24h?: number | null
    low_24h?: number | null
}

export type GetLatestPricesQueryVariables = Exact<{ [key: string]: never }>

export type GetLatestPricesQuery = {
    __typename?: 'Query'
    getLatestPrices: Array<{
        __typename?: 'TokenMarketInfo'
        id: string
        symbol: string
        name: string
        image: string
        contract?: string | null
        current_price?: number | null
        market_cap?: number | null
        total_volume?: number | null
        total_supply?: string | null
        price_change_percentage_24h?: number | null
        circulating_supply?: number | null
        high_24h?: number | null
        low_24h?: number | null
    } | null>
}

export type NewBlockFeedSubscriptionVariables = Exact<{ [key: string]: never }>

export type NewBlockFeedSubscription = {
    __typename?: 'Subscription'
    newBlockFeed: { __typename?: 'BlockSummary'; number: number; miner: string; txCount: number; timestamp: number; baseFeePerGas?: string | null }
}

export type GetNftTokensMetaQueryVariables = Exact<{
    input: Scalars['String']
}>

export type GetNftTokensMetaQuery = {
    __typename?: 'Query'
    getNFTTokensMeta?: {
        __typename?: 'RespTokens'
        nfts?: Array<{
            __typename?: 'RespNFT'
            nft_id: string
            chain: string
            contract_address: string
            token_id?: string | null
            name?: string | null
            description?: string | null
            image_url?: string | null
            video_url?: string | null
            audio_url?: string | null
            model_url?: string | null
            previews: { __typename?: 'RespNftPreviews'; image_small_url?: string | null; image_large_url?: string | null }
            extra_metadata?: { __typename?: 'RespNftMeta'; attributes: Array<{ __typename?: 'RespNftTrait'; trait_type: string; value: string }> } | null
        }> | null
    } | null
}

export type NftMetaFragment = {
    __typename?: 'RespNFT'
    nft_id: string
    chain: string
    contract_address: string
    token_id?: string | null
    name?: string | null
    description?: string | null
    image_url?: string | null
    video_url?: string | null
    audio_url?: string | null
    model_url?: string | null
    previews: { __typename?: 'RespNftPreviews'; image_small_url?: string | null; image_large_url?: string | null }
    extra_metadata?: { __typename?: 'RespNftMeta'; attributes: Array<{ __typename?: 'RespNftTrait'; trait_type: string; value: string }> } | null
}

export type EnsResolveNameQueryVariables = Exact<{
    hash: Scalars['ID']
}>

export type EnsResolveNameQuery = {
    __typename?: 'Query'
    domains: Array<{ __typename?: 'Domain'; name?: string | null; labelName?: string | null; resolvedAddress?: { __typename?: 'Account'; id: string } | null }>
}

export type AddressEventSubscriptionVariables = Exact<{
    owner: Scalars['String']
    event?: InputMaybe<AddressEventType>
}>

export type AddressEventSubscription = {
    __typename?: 'Subscription'
    addressEvent: { __typename?: 'AddressEvent'; blockNumber: number; event: AddressEventType; timestamp: number; owner: string }
}

export type BalanceFragmentFragment = { __typename?: 'BalanceDiff'; before: string; after: string }

export type RewardTransferFragment = {
    __typename?: 'EthTransfer'
    value: string
    transfer: { __typename?: 'Transfer'; block: number; timestamp: number; txFee: string }
    stateDiff?: {
        __typename?: 'StateDiffChange'
        to: { __typename?: 'BalanceDiff'; before: string; after: string }
        from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
    } | null
}

export type RewardSummaryFragment = {
    __typename?: 'ETHTransfers'
    nextKey?: string | null
    transfers: Array<{
        __typename?: 'EthTransfer'
        value: string
        transfer: { __typename?: 'Transfer'; block: number; timestamp: number; txFee: string }
        stateDiff?: {
            __typename?: 'StateDiffChange'
            to: { __typename?: 'BalanceDiff'; before: string; after: string }
            from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
        } | null
    } | null>
}

export type GetAddrRewardsBlockQueryVariables = Exact<{
    hash: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetAddrRewardsBlockQuery = {
    __typename?: 'Query'
    getBlockRewards: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: { __typename?: 'Transfer'; block: number; timestamp: number; txFee: string }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
        } | null>
    }
}

export type GetAddrRewardsUncleQueryVariables = Exact<{
    hash: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetAddrRewardsUncleQuery = {
    __typename?: 'Query'
    getUncleRewards: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: { __typename?: 'Transfer'; block: number; timestamp: number; txFee: string }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
        } | null>
    }
}

export type GetAddrRewardsGenesisQueryVariables = Exact<{
    hash: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetAddrRewardsGenesisQuery = {
    __typename?: 'Query'
    getGenesisRewards: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: { __typename?: 'Transfer'; block: number; timestamp: number; txFee: string }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
        } | null>
    }
}

export type GetBlockUncleRewardsQueryVariables = Exact<{
    blockRef: Scalars['Int']
}>

export type GetBlockUncleRewardsQuery = {
    __typename?: 'Query'
    getBlockByNumber: { __typename?: 'Block'; summary: { __typename?: 'BlockSummary'; rewards: { __typename?: 'BlockRewards'; uncles: string } } }
}

export type TokenFragmentFragment = { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null }

export type TokenOwnersFragment = {
    __typename?: 'ERC20TokenBalance'
    balance: string
    tokenInfo: { __typename?: 'EthTokenInfo'; contract: string; name?: string | null; symbol?: string | null; decimals?: number | null }
}

export type GetOwnersErc20TokensQueryVariables = Exact<{
    hash: Scalars['String']
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetOwnersErc20TokensQuery = {
    __typename?: 'Query'
    getOwnersERC20Tokens: {
        __typename?: 'ERC20TokenOwners'
        nextKey?: string | null
        owners: Array<{
            __typename?: 'ERC20TokenBalance'
            balance: string
            tokenInfo: { __typename?: 'EthTokenInfo'; contract: string; name?: string | null; symbol?: string | null; decimals?: number | null }
        } | null>
    }
}

export type Erc721BalanceFragment = {
    __typename?: 'ERC721TokenBalance'
    balance: string
    tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; contract: string }
}

export type GetOwnersErc721BalancesQueryVariables = Exact<{
    hash: Scalars['String']
}>

export type GetOwnersErc721BalancesQuery = {
    __typename?: 'Query'
    getOwnersERC721Balances: Array<{
        __typename?: 'ERC721TokenBalance'
        balance: string
        tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; contract: string }
    }>
}

export type TokenFragment = { __typename?: 'ERC721TokenOwner'; token: string }

export type OwnerErc721Fragment = {
    __typename?: 'ERC721TokenContract'
    nextKey?: string | null
    tokens: Array<{ __typename?: 'ERC721TokenOwner'; token: string } | null>
}

export type GetOwnersErc721TokensQueryVariables = Exact<{
    hash: Scalars['String']
    tokenContract?: InputMaybe<Scalars['String']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetOwnersErc721TokensQuery = {
    __typename?: 'Query'
    getOwnersERC721Tokens: {
        __typename?: 'ERC721TokenContract'
        nextKey?: string | null
        tokens: Array<{ __typename?: 'ERC721TokenOwner'; token: string } | null>
    }
}

export type PrimaryAssetContractFragment = {
    __typename?: 'PrimaryAssetContract'
    address: string
    name?: string | null
    symbol?: string | null
    total_supply?: number | null
    description?: string | null
    external_link?: string | null
    image_url?: string | null
}

export type TokenContractFragment = {
    __typename?: 'NFTContract'
    contractIdAddress: string
    owned_asset_count: number
    name?: string | null
    contractImage?: string | null
    primary_asset_contracts?: Array<{
        __typename?: 'PrimaryAssetContract'
        address: string
        name?: string | null
        symbol?: string | null
        total_supply?: number | null
        description?: string | null
        external_link?: string | null
        image_url?: string | null
    }> | null
}

export type GetNfTcontractsMetaQueryVariables = Exact<{
    address: Scalars['String']
}>

export type GetNfTcontractsMetaQuery = {
    __typename?: 'Query'
    getNFTcontractsMeta: {
        __typename?: 'AddressNFTcontracts'
        tokenContracts?: Array<{
            __typename?: 'NFTContract'
            contractIdAddress: string
            owned_asset_count: number
            name?: string | null
            contractImage?: string | null
            primary_asset_contracts?: Array<{
                __typename?: 'PrimaryAssetContract'
                address: string
                name?: string | null
                symbol?: string | null
                total_supply?: number | null
                description?: string | null
                external_link?: string | null
                image_url?: string | null
            }> | null
        } | null> | null
    }
}

export type GetOwnersNftTokensQueryVariables = Exact<{
    address: Scalars['String']
    limit: Scalars['Int']
    nextKey?: InputMaybe<Scalars['String']>
}>

export type GetOwnersNftTokensQuery = {
    __typename?: 'Query'
    getOwnersNFTTokens: {
        __typename?: 'NFTTokens'
        nextKey?: string | null
        tokens: Array<{
            __typename?: 'NFTToken'
            type: NftType
            balance: string
            tokenInfo: { __typename?: 'EthTokenInfo'; contract: string; tokenId?: string | null; name?: string | null }
        }>
    }
}

export type GetOwnersNftBalanceQueryVariables = Exact<{
    address: Scalars['String']
}>

export type GetOwnersNftBalanceQuery = { __typename?: 'Query'; getOwnersNFTBalance: { __typename?: 'NFTTokenBalance'; balance: string } }

export type TransferSummaryFragment = {
    __typename?: 'Transfer'
    transactionHash: string
    timestamp: number
    from: string
    to: string
    txFee: string
    type: TransferType
}

export type GetAddressEthTransfersQueryVariables = Exact<{
    hash?: InputMaybe<Scalars['String']>
    filter?: InputMaybe<TransferDirection>
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetAddressEthTransfersQuery = {
    __typename?: 'Query'
    fdfashtwjnakfgn: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: {
                __typename?: 'Transfer'
                block: number
                status?: boolean | null
                transactionHash: string
                timestamp: number
                from: string
                to: string
                txFee: string
                type: TransferType
            }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
        } | null>
    }
}

export type TransferFragmentFragment = {
    __typename?: 'ERC20Transfer'
    value: string
    contract: string
    transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: TransferType }
    stateDiff?: {
        __typename?: 'StateDiffChange'
        to: { __typename?: 'BalanceDiff'; before: string; after: string }
        from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
    } | null
    tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null }
}

export type GetAddressErc20TransfersQueryVariables = Exact<{
    hash: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetAddressErc20TransfersQuery = {
    __typename?: 'Query'
    getERC20Transfers: {
        __typename?: 'ERC20Transfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ERC20Transfer'
            value: string
            contract: string
            transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: TransferType }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
            tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null }
        } | null>
    }
}

export type NftTransferFragmentFragment = {
    __typename?: 'NFTTransfer'
    tokenId: string
    contract: string
    value?: string | null
    transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: TransferType }
    tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null }
}

export type GetAddressNftTransfersQueryVariables = Exact<{
    hash: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetAddressNftTransfersQuery = {
    __typename?: 'Query'
    getNFTTransfers: {
        __typename?: 'NFTTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'NFTTransfer'
            tokenId: string
            contract: string
            value?: string | null
            transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: TransferType }
            tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null }
        } | null>
    }
}

export type StateDiffFragmentFragment = { __typename?: 'TxStateDiff'; owner: string; from: string; to: string }

export type GetTransactionStateDiffQueryVariables = Exact<{
    hash: Scalars['String']
}>

export type GetTransactionStateDiffQuery = {
    __typename?: 'Query'
    getTransactionStateDiff: Array<{ __typename?: 'TxStateDiff'; owner: string; from: string; to: string } | null>
}

export type AdrWithdrawalFragment = {
    __typename?: 'ETHWithdrawalTransfer'
    validatorIndex: string
    value: string
    transfer: { __typename?: 'Transfer'; block: number; timestamp: number }
}

export type GetAdrWithdrawalsQueryVariables = Exact<{
    address: Scalars['String']
    nextKey?: InputMaybe<Scalars['String']>
    limit: Scalars['Int']
}>

export type GetAdrWithdrawalsQuery = {
    __typename?: 'Query'
    getEthWithdrawalTransfers: {
        __typename?: 'ETHWithdrawalTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ETHWithdrawalTransfer'
            validatorIndex: string
            value: string
            transfer: { __typename?: 'Transfer'; block: number; timestamp: number }
        }>
    }
}

export type AllTransfersFragment = {
    __typename?: 'Transfer'
    type: TransferType
    subtype: TransferSubtype
    transactionHash: string
    block: number
    timestamp: number
    from: string
    to: string
    txFee: string
    status?: boolean | null
    validatorIndex?: string | null
}

export type AllEthTransfersFragment = {
    __typename?: 'EthTransfer'
    value: string
    transfer: {
        __typename?: 'Transfer'
        type: TransferType
        subtype: TransferSubtype
        transactionHash: string
        block: number
        timestamp: number
        from: string
        to: string
        txFee: string
        status?: boolean | null
        validatorIndex?: string | null
    }
    stateDiff?: {
        __typename?: 'StateDiffChange'
        to: { __typename?: 'BalanceDiff'; before: string; after: string }
        from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
    } | null
}

export type GetAllEthTransfersQueryVariables = Exact<{
    hash: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetAllEthTransfersQuery = {
    __typename?: 'Query'
    getAllEthTransfers: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: {
                __typename?: 'Transfer'
                type: TransferType
                subtype: TransferSubtype
                transactionHash: string
                block: number
                timestamp: number
                from: string
                to: string
                txFee: string
                status?: boolean | null
                validatorIndex?: string | null
            }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
        } | null>
    }
}

export type InternalTransactionTransferFragment = {
    __typename?: 'Transfer'
    type: TransferType
    subtype: TransferSubtype
    transactionHash: string
    block: number
    timestamp: number
    from: string
    to: string
    txFee: string
    status?: boolean | null
}

export type EthInternalTransactionTransfersFragment = {
    __typename?: 'EthTransfer'
    value: string
    transfer: {
        __typename?: 'Transfer'
        type: TransferType
        subtype: TransferSubtype
        transactionHash: string
        block: number
        timestamp: number
        from: string
        to: string
        txFee: string
        status?: boolean | null
    }
    stateDiff?: {
        __typename?: 'StateDiffChange'
        to: { __typename?: 'BalanceDiff'; before: string; after: string }
        from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
    } | null
}

export type GetEthInternalTransactionTransfersQueryVariables = Exact<{
    hash: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetEthInternalTransactionTransfersQuery = {
    __typename?: 'Query'
    getEthInternalTransactionTransfers: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: {
                __typename?: 'Transfer'
                type: TransferType
                subtype: TransferSubtype
                transactionHash: string
                block: number
                timestamp: number
                from: string
                to: string
                txFee: string
                status?: boolean | null
            }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
        } | null>
    }
}

export type PendingTxsFragmentFragment = {
    __typename?: 'Tx'
    baseFeePerGas?: string | null
    blockHash?: string | null
    blockNumber?: number | null
    contractAddress?: string | null
    from: string
    gas: string
    gasPrice: string
    gasUsed?: string | null
    hash: string
    input: string
    maxFeePerGas?: string | null
    maxPriorityFeePerGas?: string | null
    nonce: number
    r?: string | null
    replacedBy?: string | null
    s?: string | null
    status?: string | null
    timestamp?: number | null
    to?: string | null
    transactionIndex?: number | null
    v?: string | null
    value: string
    logs: Array<{ __typename?: 'Log'; address: string; data: string; logIndex: number; removed: boolean; topics: Array<string>; type?: string | null }>
    trace?: Array<{
        __typename?: 'Trace'
        subtraces?: number | null
        traceAddress?: Array<number> | null
        transactionPosition?: number | null
        type?: string | null
        action?: {
            __typename?: 'TraceAction'
            callType?: string | null
            from?: string | null
            gas?: string | null
            input?: string | null
            to?: string | null
            value?: string | null
        } | null
        result?: { __typename?: 'TraceResult'; gasUsed?: string | null; output?: string | null } | null
    }> | null
}

export type GetPendingTransactionsQueryVariables = Exact<{
    hash: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetPendingTransactionsQuery = {
    __typename?: 'Query'
    getPendingTransactionsV2: {
        __typename?: 'PendingTransactions'
        nextKey?: string | null
        items: Array<{
            __typename?: 'Tx'
            baseFeePerGas?: string | null
            blockHash?: string | null
            blockNumber?: number | null
            contractAddress?: string | null
            from: string
            gas: string
            gasPrice: string
            gasUsed?: string | null
            hash: string
            input: string
            maxFeePerGas?: string | null
            maxPriorityFeePerGas?: string | null
            nonce: number
            r?: string | null
            replacedBy?: string | null
            s?: string | null
            status?: string | null
            timestamp?: number | null
            to?: string | null
            transactionIndex?: number | null
            v?: string | null
            value: string
            logs: Array<{ __typename?: 'Log'; address: string; data: string; logIndex: number; removed: boolean; topics: Array<string>; type?: string | null }>
            trace?: Array<{
                __typename?: 'Trace'
                subtraces?: number | null
                traceAddress?: Array<number> | null
                transactionPosition?: number | null
                type?: string | null
                action?: {
                    __typename?: 'TraceAction'
                    callType?: string | null
                    from?: string | null
                    gas?: string | null
                    input?: string | null
                    to?: string | null
                    value?: string | null
                } | null
                result?: { __typename?: 'TraceResult'; gasUsed?: string | null; output?: string | null } | null
            }> | null
        }>
    }
}

export type TransfersFragment = {
    __typename?: 'Transfer'
    type: TransferType
    subtype: TransferSubtype
    transactionHash: string
    block: number
    timestamp: number
    from: string
    to: string
    txFee: string
    status?: boolean | null
}

export type TxsTransfersFragment = {
    __typename?: 'ETHTransactionTransfer'
    value: string
    transfer: {
        __typename?: 'Transfer'
        type: TransferType
        subtype: TransferSubtype
        transactionHash: string
        block: number
        timestamp: number
        from: string
        to: string
        txFee: string
        status?: boolean | null
    }
    stateDiff?: {
        __typename?: 'StateDiffChange'
        to: { __typename?: 'BalanceDiff'; before: string; after: string }
        from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
    } | null
    transactionStateDiff: {
        __typename?: 'TransactionStateDiffChange'
        to: { __typename?: 'BalanceDiff'; before: string; after: string }
        from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
    }
}

export type GetEthTransactionTransfersQueryVariables = Exact<{
    direction?: InputMaybe<TransferDirection>
    hash: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetEthTransactionTransfersQuery = {
    __typename?: 'Query'
    getEthTransactionTransfers: {
        __typename?: 'ETHTransactionTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ETHTransactionTransfer'
            value: string
            transfer: {
                __typename?: 'Transfer'
                type: TransferType
                subtype: TransferSubtype
                transactionHash: string
                block: number
                timestamp: number
                from: string
                to: string
                txFee: string
                status?: boolean | null
            }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
            transactionStateDiff: {
                __typename?: 'TransactionStateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            }
        }>
    }
}

export type GetEthTransfersByHashQueryVariables = Exact<{
    owner: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    hash: Scalars['String']
}>

export type GetEthTransfersByHashQuery = {
    __typename?: 'Query'
    getEthTransfersByHash: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            transfer: { __typename?: 'Transfer'; type: TransferType; subtype: TransferSubtype; transactionHash: string }
        } | null>
    }
}

export type BlockDetailsFragment = {
    __typename?: 'Block'
    hash: string
    parentHash: string
    nonce: string
    sha3Uncles: string
    logsBloom: string
    transactionsRoot: string
    stateRoot: string
    receiptsRoot: string
    difficulty: string
    totalDifficulty: string
    extraData: string
    size: number
    gasLimit: number
    gasUsed: number
    transactions: Array<string | null>
    withdrawalCount: number
    summary: {
        __typename?: 'BlockSummary'
        number: number
        miner: string
        txCount: number
        timestamp: number
        uncles: Array<string | null>
        txFail: number
        baseFeePerGas?: string | null
        rewards: { __typename?: 'BlockRewards'; txFees: string; total: string; uncles: string }
    }
}

export type GetBlockByNumberQueryVariables = Exact<{
    blockRef: Scalars['Int']
}>

export type GetBlockByNumberQuery = {
    __typename?: 'Query'
    getBlockByNumber: {
        __typename?: 'Block'
        hash: string
        parentHash: string
        nonce: string
        sha3Uncles: string
        logsBloom: string
        transactionsRoot: string
        stateRoot: string
        receiptsRoot: string
        difficulty: string
        totalDifficulty: string
        extraData: string
        size: number
        gasLimit: number
        gasUsed: number
        transactions: Array<string | null>
        withdrawalCount: number
        summary: {
            __typename?: 'BlockSummary'
            number: number
            miner: string
            txCount: number
            timestamp: number
            uncles: Array<string | null>
            txFail: number
            baseFeePerGas?: string | null
            rewards: { __typename?: 'BlockRewards'; txFees: string; total: string; uncles: string }
        }
    }
}

export type GetBlockByHashQueryVariables = Exact<{
    blockRef: Scalars['String']
}>

export type GetBlockByHashQuery = {
    __typename?: 'Query'
    getBlockByHash: {
        __typename?: 'Block'
        hash: string
        parentHash: string
        nonce: string
        sha3Uncles: string
        logsBloom: string
        transactionsRoot: string
        stateRoot: string
        receiptsRoot: string
        difficulty: string
        totalDifficulty: string
        extraData: string
        size: number
        gasLimit: number
        gasUsed: number
        transactions: Array<string | null>
        withdrawalCount: number
        summary: {
            __typename?: 'BlockSummary'
            number: number
            miner: string
            txCount: number
            timestamp: number
            uncles: Array<string | null>
            txFail: number
            baseFeePerGas?: string | null
            rewards: { __typename?: 'BlockRewards'; txFees: string; total: string; uncles: string }
        }
    }
}

export type GetLastBlockNumberQueryVariables = Exact<{ [key: string]: never }>

export type GetLastBlockNumberQuery = { __typename?: 'Query'; getLatestBlockInfo: { __typename?: 'LatestBlockData'; number: number } }

export type BlockInfoFragment = {
    __typename?: 'LatestBlockData'
    number: number
    avgBlockTime: number
    hashRate: string
    difficulty: string
    avgGasPrice: string
    baseFeePerGas?: string | null
}

export type GetLatestBlockInfoQueryVariables = Exact<{ [key: string]: never }>

export type GetLatestBlockInfoQuery = {
    __typename?: 'Query'
    getLatestBlockInfo: {
        __typename?: 'LatestBlockData'
        number: number
        avgBlockTime: number
        hashRate: string
        difficulty: string
        avgGasPrice: string
        baseFeePerGas?: string | null
    }
}

export type BlockWithdrawalFragment = {
    __typename?: 'ETHWithdrawalTransfer'
    validatorIndex: string
    value: string
    transfer: { __typename?: 'Transfer'; to: string }
}

export type GetBlockWithdrawalsQueryVariables = Exact<{
    blockNumber: Scalars['Int']
    nextKey?: InputMaybe<Scalars['String']>
}>

export type GetBlockWithdrawalsQuery = {
    __typename?: 'Query'
    getEthWithdrawalTransfers: {
        __typename?: 'ETHWithdrawalTransfers'
        nextKey?: string | null
        transfers: Array<{ __typename?: 'ETHWithdrawalTransfer'; validatorIndex: string; value: string; transfer: { __typename?: 'Transfer'; to: string } }>
    }
}

export type BlockSummaryFragment = {
    __typename?: 'BlockSummary'
    number: number
    miner: string
    txCount: number
    timestamp: number
    txFail: number
    rewards: { __typename?: 'BlockRewards'; total: string }
}

export type GetBlocksArrayByNumberQueryVariables = Exact<{
    fromBlock?: InputMaybe<Scalars['Int']>
    limit?: InputMaybe<Scalars['Int']>
}>

export type GetBlocksArrayByNumberQuery = {
    __typename?: 'Query'
    getBlocksArrayByNumber: Array<{
        __typename?: 'BlockSummary'
        number: number
        miner: string
        txCount: number
        timestamp: number
        txFail: number
        rewards: { __typename?: 'BlockRewards'; total: string }
    } | null>
}

export type NewBlockTableSubscriptionVariables = Exact<{ [key: string]: never }>

export type NewBlockTableSubscription = {
    __typename?: 'Subscription'
    newBlockFeed: {
        __typename?: 'BlockSummary'
        number: number
        miner: string
        txCount: number
        timestamp: number
        rewards: { __typename?: 'BlockRewards'; total: string }
    }
}

export type GetHashTypeQueryVariables = Exact<{
    hash: Scalars['String']
}>

export type GetHashTypeQuery = { __typename?: 'Query'; getHashType: HashType }

export type GetTokensBeginsWithQueryVariables = Exact<{
    keyword: Scalars['String']
}>

export type GetTokensBeginsWithQuery = {
    __typename?: 'Query'
    getTokensBeginsWith: Array<{ __typename?: 'TokenSearch'; contract: string; keyword: string } | null>
}

export type BigMoverFragment = {
    __typename?: 'TokenMarketMoversItem'
    contractAddress?: string | null
    name: string
    symbol: string
    type: TokenMarketMoverType
    eventTimestampUnixSec: number
    price?: number | null
    iconPng?: string | null
    priceChangePercentage?: number | null
    coingeckoCoinId: string
}

export type GetBigMoversQueryVariables = Exact<{ [key: string]: never }>

export type GetBigMoversQuery = {
    __typename?: 'Query'
    getTokenMarketMovers: {
        __typename?: 'GetTokenMarketMoversResult'
        items: Array<{
            __typename?: 'TokenMarketMoversItem'
            contractAddress?: string | null
            name: string
            symbol: string
            type: TokenMarketMoverType
            eventTimestampUnixSec: number
            price?: number | null
            iconPng?: string | null
            priceChangePercentage?: number | null
            coingeckoCoinId: string
        }>
    }
}

export type BigMoversUpdateSubscriptionVariables = Exact<{ [key: string]: never }>

export type BigMoversUpdateSubscription = {
    __typename?: 'Subscription'
    tokenMarketMoversProcessedEvent: { __typename?: 'TokenMarketMoverProcessedEventResult'; _?: string | null }
}

export type Erc20TokenOwnersFragment = {
    __typename?: 'ERC20TokenOwners'
    nextKey?: string | null
    owners: Array<{
        __typename?: 'ERC20TokenBalance'
        owner: string
        balance: string
        tokenInfo: {
            __typename?: 'EthTokenInfo'
            name?: string | null
            symbol?: string | null
            decimals?: number | null
            totalSupply?: string | null
            contract: string
            tokenId?: string | null
        }
    } | null>
}

export type Erc721TokenOwnerDetailsFragment = {
    __typename?: 'ERC721TokenOwner'
    owner: string
    tokenId: string
    tokenInfo: {
        __typename?: 'EthTokenInfo'
        name?: string | null
        symbol?: string | null
        decimals?: number | null
        totalSupply?: string | null
        contract: string
        tokenId?: string | null
    }
}

export type Erc721TokenOwnersFragment = {
    __typename?: 'ERC721TokenOwners'
    nextKey?: string | null
    owners: Array<{
        __typename?: 'ERC721TokenOwner'
        owner: string
        tokenId: string
        tokenInfo: {
            __typename?: 'EthTokenInfo'
            name?: string | null
            symbol?: string | null
            decimals?: number | null
            totalSupply?: string | null
            contract: string
            tokenId?: string | null
        }
    } | null>
}

export type Erc1155TokenOwnerDetailsFragment = {
    __typename?: 'ERC1155TokenBalance'
    owner: string
    balance: string
    tokenInfo: {
        __typename?: 'EthTokenInfo'
        name?: string | null
        symbol?: string | null
        decimals?: number | null
        totalSupply?: string | null
        contract: string
        tokenId?: string | null
    }
}

export type Erc1155TokenOwnersFragment = {
    __typename?: 'ERC1155TokenBalances'
    nextKey?: string | null
    balances: Array<{
        __typename?: 'ERC1155TokenBalance'
        owner: string
        balance: string
        tokenInfo: {
            __typename?: 'EthTokenInfo'
            name?: string | null
            symbol?: string | null
            decimals?: number | null
            totalSupply?: string | null
            contract: string
            tokenId?: string | null
        }
    }>
}

export type GetErc20TokenOwnersQueryVariables = Exact<{
    contract: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetErc20TokenOwnersQuery = {
    __typename?: 'Query'
    getERC20TokenOwners: {
        __typename?: 'ERC20TokenOwners'
        nextKey?: string | null
        owners: Array<{
            __typename?: 'ERC20TokenBalance'
            owner: string
            balance: string
            tokenInfo: {
                __typename?: 'EthTokenInfo'
                name?: string | null
                symbol?: string | null
                decimals?: number | null
                totalSupply?: string | null
                contract: string
                tokenId?: string | null
            }
        } | null>
    }
}

export type GetErc721TokenOwnersQueryVariables = Exact<{
    contract: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetErc721TokenOwnersQuery = {
    __typename?: 'Query'
    getERC721TokenOwners: {
        __typename?: 'ERC721TokenOwners'
        nextKey?: string | null
        owners: Array<{
            __typename?: 'ERC721TokenOwner'
            owner: string
            tokenId: string
            tokenInfo: {
                __typename?: 'EthTokenInfo'
                name?: string | null
                symbol?: string | null
                decimals?: number | null
                totalSupply?: string | null
                contract: string
                tokenId?: string | null
            }
        } | null>
    }
}

export type GetErc1155TokenOwnersQueryVariables = Exact<{
    contract: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetErc1155TokenOwnersQuery = {
    __typename?: 'Query'
    getERC1155TokensByContract: {
        __typename?: 'ERC1155TokenBalances'
        nextKey?: string | null
        balances: Array<{
            __typename?: 'ERC1155TokenBalance'
            owner: string
            balance: string
            tokenInfo: {
                __typename?: 'EthTokenInfo'
                name?: string | null
                symbol?: string | null
                decimals?: number | null
                totalSupply?: string | null
                contract: string
                tokenId?: string | null
            }
        }>
    }
}

export type TokenInfoFragment = {
    __typename?: 'EthTokenInfo'
    name?: string | null
    symbol?: string | null
    decimals?: number | null
    totalSupply?: string | null
    contract: string
}

export type TokenTransferFragment = {
    __typename?: 'ERC20Transfer'
    value: string
    transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: TransferType }
}

export type Erc20TokenTransfersFragment = {
    __typename?: 'ERC20Transfers'
    nextKey?: string | null
    transfers: Array<{
        __typename?: 'ERC20Transfer'
        value: string
        transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: TransferType }
    } | null>
}

export type GetErc20TokenTransfersQueryVariables = Exact<{
    _contract: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetErc20TokenTransfersQuery = {
    __typename?: 'Query'
    getERC20TokenTransfers: {
        __typename?: 'ERC20Transfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ERC20Transfer'
            value: string
            transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: TransferType }
        } | null>
    }
}

export type Erc721TransferFragment = {
    __typename?: 'ERC721Transfer'
    tokenId: string
    contract: string
    transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: TransferType }
    tokenInfo: {
        __typename?: 'EthTokenInfo'
        name?: string | null
        symbol?: string | null
        decimals?: number | null
        totalSupply?: string | null
        contract: string
    }
}

export type Erc721TokenTransfersFragment = {
    __typename?: 'ERC721Transfers'
    nextKey?: string | null
    transfers: Array<{
        __typename?: 'ERC721Transfer'
        tokenId: string
        contract: string
        transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: TransferType }
        tokenInfo: {
            __typename?: 'EthTokenInfo'
            name?: string | null
            symbol?: string | null
            decimals?: number | null
            totalSupply?: string | null
            contract: string
        }
    } | null>
}

export type GetErc721TokenTransfersQueryVariables = Exact<{
    _contract: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetErc721TokenTransfersQuery = {
    __typename?: 'Query'
    getERC721TokenTransfers: {
        __typename?: 'ERC721Transfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ERC721Transfer'
            tokenId: string
            contract: string
            transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: TransferType }
            tokenInfo: {
                __typename?: 'EthTokenInfo'
                name?: string | null
                symbol?: string | null
                decimals?: number | null
                totalSupply?: string | null
                contract: string
            }
        } | null>
    }
}

export type Erc1155TokenTransferFragment = {
    __typename?: 'ERC1155Transfer'
    tokenId: string
    value: string
    contract: string
    transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: TransferType }
    tokenInfo: {
        __typename?: 'EthTokenInfo'
        name?: string | null
        symbol?: string | null
        decimals?: number | null
        totalSupply?: string | null
        contract: string
    }
}

export type Erc1155TokenTransfersFragment = {
    __typename?: 'ERC1155Transfers'
    nextKey?: string | null
    transfers: Array<{
        __typename?: 'ERC1155Transfer'
        tokenId: string
        value: string
        contract: string
        transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: TransferType }
        tokenInfo: {
            __typename?: 'EthTokenInfo'
            name?: string | null
            symbol?: string | null
            decimals?: number | null
            totalSupply?: string | null
            contract: string
        }
    } | null>
}

export type GetErc1155TokenTransfersQueryVariables = Exact<{
    _contract: Scalars['String']
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetErc1155TokenTransfersQuery = {
    __typename?: 'Query'
    getERC1155TokenTransfers: {
        __typename?: 'ERC1155Transfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ERC1155Transfer'
            tokenId: string
            value: string
            contract: string
            transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: TransferType }
            tokenInfo: {
                __typename?: 'EthTokenInfo'
                name?: string | null
                symbol?: string | null
                decimals?: number | null
                totalSupply?: string | null
                contract: string
            }
        } | null>
    }
}

export type TokenDetailsFragment = {
    __typename?: 'EthTokenInfo'
    name?: string | null
    symbol?: string | null
    decimals?: number | null
    totalSupply?: string | null
    contract: string
    tokenId?: string | null
}

export type Erc20TokenOwnerDetailsFragment = {
    __typename?: 'ERC20TokenBalance'
    owner: string
    balance: string
    tokenInfo: {
        __typename?: 'EthTokenInfo'
        name?: string | null
        symbol?: string | null
        decimals?: number | null
        totalSupply?: string | null
        contract: string
        tokenId?: string | null
    }
}

export type GetTokenInfoByContractQueryVariables = Exact<{
    contract: Scalars['String']
}>

export type GetTokenInfoByContractQuery = {
    __typename?: 'Query'
    getTokenInfoByContract: {
        __typename?: 'EthTokenInfo'
        name?: string | null
        symbol?: string | null
        decimals?: number | null
        totalSupply?: string | null
        contract: string
        tokenId?: string | null
    }
}

export type GetErc20TokenBalanceQueryVariables = Exact<{
    contract: Scalars['String']
    owner: Scalars['String']
}>

export type GetErc20TokenBalanceQuery = {
    __typename?: 'Query'
    getERC20TokenBalance: {
        __typename?: 'ERC20TokenBalance'
        owner: string
        balance: string
        tokenInfo: {
            __typename?: 'EthTokenInfo'
            name?: string | null
            symbol?: string | null
            decimals?: number | null
            totalSupply?: string | null
            contract: string
            tokenId?: string | null
        }
    }
}

export type GetNftContractMetaQueryVariables = Exact<{
    input: Scalars['String']
}>

export type GetNftContractMetaQuery = {
    __typename?: 'Query'
    getNFTContractMeta?: {
        __typename?: 'RespCollections'
        nextKey?: string | null
        collections: Array<{
            __typename?: 'RespCollection'
            name?: string | null
            description?: string | null
            image_url?: string | null
            external_url?: string | null
            twitter_username?: string | null
            discord_url?: string | null
            distinct_owner_count?: number | null
            distinct_nft_count?: number | null
            floor_prices: Array<{
                __typename?: 'RespNftFloorPrice'
                value?: number | null
                payment_token: { __typename?: 'RespPaymentToken'; name?: string | null; address?: string | null }
            }>
        }>
    } | null
}

export type NftCollectionFragment = {
    __typename?: 'RespCollection'
    name?: string | null
    description?: string | null
    image_url?: string | null
    external_url?: string | null
    twitter_username?: string | null
    discord_url?: string | null
    distinct_owner_count?: number | null
    distinct_nft_count?: number | null
    floor_prices: Array<{
        __typename?: 'RespNftFloorPrice'
        value?: number | null
        payment_token: { __typename?: 'RespPaymentToken'; name?: string | null; address?: string | null }
    }>
}

export type EthTransferInTxFragment = {
    __typename?: 'EthTransfer'
    value: string
    transfer: { __typename?: 'Transfer'; type: TransferType; from: string; to: string }
}

export type GetEthTransfersInTxQueryVariables = Exact<{
    limit?: InputMaybe<Scalars['Int']>
    hash: Scalars['String']
    nextKey?: InputMaybe<Scalars['String']>
}>

export type GetEthTransfersInTxQuery = {
    __typename?: 'Query'
    getEthTransfersByHash: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: { __typename?: 'Transfer'; type: TransferType; from: string; to: string }
        } | null>
    }
}

export type Erc20TransferInTxFragment = {
    __typename?: 'ERC20Transfer'
    value: string
    contract: string
    transfer: { __typename?: 'Transfer'; type: TransferType; from: string; to: string }
    tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null; iconPng?: string | null }
}

export type Erc20MetaFragment = {
    __typename?: 'ERC20Transfer'
    contract: string
    tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null; iconPng?: string | null }
}

export type GetErc20TransfersInTxQueryVariables = Exact<{
    limit?: InputMaybe<Scalars['Int']>
    hash: Scalars['String']
    nextKey?: InputMaybe<Scalars['String']>
}>

export type GetErc20TransfersInTxQuery = {
    __typename?: 'Query'
    getERC20TransfersByHash: {
        __typename?: 'ERC20Transfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ERC20Transfer'
            value: string
            contract: string
            transfer: { __typename?: 'Transfer'; type: TransferType; from: string; to: string }
            tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null; iconPng?: string | null }
        } | null>
    }
}

export type NftTransferInTxFragment = {
    __typename?: 'NFTTransfer'
    value?: string | null
    tokenId: string
    contract: string
    transfer: { __typename?: 'Transfer'; type: TransferType; from: string; to: string }
    tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null; iconPng?: string | null }
}

export type GetNftTransfersInTxQueryVariables = Exact<{
    limit?: InputMaybe<Scalars['Int']>
    hash: Scalars['String']
    nextKey?: InputMaybe<Scalars['String']>
}>

export type GetNftTransfersInTxQuery = {
    __typename?: 'Query'
    getNFTTransfersByHash: {
        __typename?: 'NFTTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'NFTTransfer'
            value?: string | null
            tokenId: string
            contract: string
            transfer: { __typename?: 'Transfer'; type: TransferType; from: string; to: string }
            tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null; iconPng?: string | null }
        } | null>
    }
}

export type LogFragmentFragment = {
    __typename?: 'Log'
    address: string
    data: string
    logIndex: number
    removed: boolean
    topics: Array<string>
    type?: string | null
    signature?: string | null
}

export type TraceActionFragment = {
    __typename?: 'TraceAction'
    callType?: string | null
    from?: string | null
    gas?: string | null
    input?: string | null
    to?: string | null
    value?: string | null
}

export type TraceResultFragment = { __typename?: 'TraceResult'; gasUsed?: string | null; output?: string | null }

export type TraceFragmentFragment = {
    __typename?: 'Trace'
    subtraces?: number | null
    traceAddress?: Array<number> | null
    transactionPosition?: number | null
    type?: string | null
    action?: {
        __typename?: 'TraceAction'
        callType?: string | null
        from?: string | null
        gas?: string | null
        input?: string | null
        to?: string | null
        value?: string | null
    } | null
    result?: { __typename?: 'TraceResult'; gasUsed?: string | null; output?: string | null } | null
}

export type TxDetailsFragment = {
    __typename?: 'Tx'
    blockHash?: string | null
    blockNumber?: number | null
    from: string
    gas: string
    gasPrice: string
    maxFeePerGas?: string | null
    maxPriorityFeePerGas?: string | null
    baseFeePerGas?: string | null
    timestamp?: number | null
    gasUsed?: string | null
    hash: string
    status?: string | null
    input: string
    nonce: number
    to?: string | null
    transactionIndex?: number | null
    value: string
    replacedBy?: string | null
    v?: string | null
    r?: string | null
    s?: string | null
    contractAddress?: string | null
    isContractCall?: boolean | null
    logs: Array<{
        __typename?: 'Log'
        address: string
        data: string
        logIndex: number
        removed: boolean
        topics: Array<string>
        type?: string | null
        signature?: string | null
    }>
}

export type GetTransactionByHashQueryVariables = Exact<{
    hash: Scalars['String']
}>

export type GetTransactionByHashQuery = {
    __typename?: 'Query'
    getTransactionByHash: {
        __typename?: 'Tx'
        blockHash?: string | null
        blockNumber?: number | null
        from: string
        gas: string
        gasPrice: string
        maxFeePerGas?: string | null
        maxPriorityFeePerGas?: string | null
        baseFeePerGas?: string | null
        timestamp?: number | null
        gasUsed?: string | null
        hash: string
        status?: string | null
        input: string
        nonce: number
        to?: string | null
        transactionIndex?: number | null
        value: string
        replacedBy?: string | null
        v?: string | null
        r?: string | null
        s?: string | null
        contractAddress?: string | null
        isContractCall?: boolean | null
        logs: Array<{
            __typename?: 'Log'
            address: string
            data: string
            logIndex: number
            removed: boolean
            topics: Array<string>
            type?: string | null
            signature?: string | null
        }>
    }
}

export type TransactionEventSubscriptionVariables = Exact<{
    hash: Scalars['String']
}>

export type TransactionEventSubscription = { __typename?: 'Subscription'; transactionEvent: string }

export type SummaryFragment = {
    __typename?: 'Transfer'
    transactionHash: string
    to: string
    block: number
    timestamp: number
    from: string
    txFee: string
    status?: boolean | null
}

export type BlockTransactionFragment = {
    __typename?: 'EthTransfer'
    value: string
    transfer: {
        __typename?: 'Transfer'
        transactionHash: string
        to: string
        block: number
        timestamp: number
        from: string
        txFee: string
        status?: boolean | null
    }
}

export type BlockTransactionsFragment = {
    __typename?: 'ETHTransfers'
    transfers: Array<{
        __typename?: 'EthTransfer'
        value: string
        transfer: {
            __typename?: 'Transfer'
            transactionHash: string
            to: string
            block: number
            timestamp: number
            from: string
            txFee: string
            status?: boolean | null
        }
    } | null>
}

export type GetBlockTransfersQueryVariables = Exact<{
    _number?: InputMaybe<Scalars['Int']>
}>

export type GetBlockTransfersQuery = {
    __typename?: 'Query'
    getBlockTransfers: {
        __typename?: 'ETHTransfers'
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: {
                __typename?: 'Transfer'
                transactionHash: string
                to: string
                block: number
                timestamp: number
                from: string
                txFee: string
                status?: boolean | null
            }
        } | null>
    }
}

export type TransferFragment = {
    __typename?: 'ETHTransactionTransfer'
    value: string
    transfer: {
        __typename?: 'Transfer'
        transactionHash: string
        to: string
        block: number
        timestamp: number
        from: string
        txFee: string
        status?: boolean | null
    }
}

export type EthTransfersFragment = {
    __typename?: 'ETHTransactionTransfers'
    nextKey?: string | null
    transfers: Array<{
        __typename?: 'ETHTransactionTransfer'
        value: string
        transfer: {
            __typename?: 'Transfer'
            transactionHash: string
            to: string
            block: number
            timestamp: number
            from: string
            txFee: string
            status?: boolean | null
        }
    }>
}

export type GetAllTxsQueryVariables = Exact<{
    _limit?: InputMaybe<Scalars['Int']>
    _nextKey?: InputMaybe<Scalars['String']>
}>

export type GetAllTxsQuery = {
    __typename?: 'Query'
    getEthTransactionTransfers: {
        __typename?: 'ETHTransactionTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ETHTransactionTransfer'
            value: string
            transfer: {
                __typename?: 'Transfer'
                transactionHash: string
                to: string
                block: number
                timestamp: number
                from: string
                txFee: string
                status?: boolean | null
            }
        }>
    }
}

export type NewTransfersCompleteFeedSubscriptionVariables = Exact<{ [key: string]: never }>

export type NewTransfersCompleteFeedSubscription = {
    __typename?: 'Subscription'
    newTransfersCompleteFeed: { __typename?: 'TransferComplete'; block: number; type: TransferType }
}

export type UncleDetailsFragment = {
    __typename?: 'Uncle'
    unclePosition: number
    parentBlockNumber: number
    block: {
        __typename?: 'Block'
        hash: string
        sha3Uncles: string
        gasLimit: number
        gasUsed: number
        summary: { __typename?: 'BlockSummary'; number: number; miner: string; timestamp: number }
    }
}

export type GetUncleByHashQueryVariables = Exact<{
    hash: Scalars['String']
}>

export type GetUncleByHashQuery = {
    __typename?: 'Query'
    getUncleByHash: {
        __typename?: 'Uncle'
        unclePosition: number
        parentBlockNumber: number
        block: {
            __typename?: 'Block'
            hash: string
            sha3Uncles: string
            gasLimit: number
            gasUsed: number
            summary: { __typename?: 'BlockSummary'; number: number; miner: string; timestamp: number }
        }
    }
}
