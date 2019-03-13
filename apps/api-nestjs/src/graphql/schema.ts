/* tslint:disable */
export enum BalanceType {
    TX_FEE = "TX_FEE",
    REWARD = "REWARD",
    ETHER = "ETHER",
    ERC20 = "ERC20",
    ERC721 = "ERC721"
}

export class AccountMetadata {
    id?: string;
    inTxCount?: number;
    isContractCreator?: boolean;
    isMiner?: boolean;
    outTxCount?: number;
    totalTxCount?: number;
}

export class Action {
    TraceCallActionRecord?: TraceCallActionRecord;
    TraceCreateActionRecord?: TraceCreateActionRecord;
    TraceDestroyActionRecord?: TraceDestroyActionRecord;
    TraceRewardActionRecord?: TraceRewardActionRecord;
}

export class Balance {
    id?: BalanceKey;
    address?: string;
    amount?: string;
    balanceType?: BalanceType;
}

export class BalanceKey {
    balanceType?: BalanceType;
    address?: string;
}

export class Block {
    id?: Decimal;
    totalDifficulty?: string;
    header?: Header;
    rewards?: Reward[];
    transactions?: Transaction[];
    uncles?: Uncle[];
}

export class BlockMetric {
    id?: Decimal;
    avgGasLimit?: string;
    avgGasPrice?: string;
    avgTxFees?: string;
    blockTime?: string;
    difficulty?: string;
    hash?: string;
    number?: number;
    numFailedTxs?: number;
    numPendingTxs?: number;
    numSuccessfulTxs?: number;
    numUncles?: number;
    timestamp?: number;
    totalDifficulty?: string;
    totalTxs?: number;
}

export class Header {
    author?: string;
    difficulty?: string;
    extraData?: string;
    gasLimit?: string;
    gasUsed?: string;
    hash?: string;
    logsBloom?: string;
    nonce?: string;
    number?: number;
    parentHash?: string;
    receiptsRoot?: string;
    sha3Uncles?: string;
    size?: number;
    stateRoot?: string;
    timestamp?: number;
    transactionsRoot?: string;
}

export class Log {
    address?: string;
    data?: string;
    topics?: string[];
}

export abstract class IQuery {
    abstract accountMetadataByHash(hash: string): AccountMetadata | Promise<AccountMetadata>;

    abstract balanceByHash(hash: string): Balance | Promise<Balance>;

    abstract blockMetricByHash(hash?: string): BlockMetric | Promise<BlockMetric>;

    abstract blockMetrics(limit?: number, page?: number): BlockMetric[] | Promise<BlockMetric[]>;

    abstract blocks(limit?: number, page?: number): Block[] | Promise<Block[]>;

    abstract block(hash?: string): Block | Promise<Block>;

    abstract temp__(): boolean | Promise<boolean>;
}

export class Receipt {
    blockHash?: string;
    blockNumber?: number;
    contractAddress?: string;
    cumulativeGasUsed?: string;
    gasUsed?: string;
    logsBloom?: string;
    numInternalTxs?: number;
    root?: string;
    transactionHash?: string;
    transactionIndex?: string;
    logs?: Log[];
    traces?: Trace[];
}

export class Result {
    address?: string;
    code?: string;
    gasUsed?: string;
    output?: string;
}

export class Reward {
    author?: string;
    rewardType?: string;
    value?: string;
}

export abstract class ISubscription {
    abstract newBlock(): Block[] | Promise<Block[]>;
}

export class Trace {
    blockHash?: string;
    blockNumber?: number;
    error?: string;
    subtraces?: number;
    traceAddress?: number[];
    transactionHash?: string;
    transactionPosition?: number;
    type?: string;
    action?: Action;
    result?: Result;
}

export class TraceCallActionRecord {
    callType?: string;
    from?: string;
    gas?: string;
    input?: string;
    to?: string;
    value?: string;
}

export class TraceCreateActionRecord {
    from?: string;
    gas?: string;
    init?: string;
    value?: string;
}

export class TraceDestroyActionRecord {
    address?: string;
    balance?: string;
    refundAddress?: string;
}

export class TraceRewardActionRecord {
    author?: string;
    value?: string;
    rewardType?: string;
}

export class Transaction {
    blockHash?: string;
    blockNumber?: number;
    creates?: string;
    from?: string;
    gas?: string;
    gasPrice?: string;
    hash?: string;
    input?: string;
    nonce?: string;
    r?: string;
    s?: string;
    timestamp?: number;
    to?: string;
    transactionIndex?: number;
    v?: number;
    value?: string;
    receipt?: Receipt;
}

export class Uncle {
    id?: string;
    blockNumber?: number;
    uncleIndex?: number;
    author?: string;
    difficulty?: string;
    extraData?: string;
    gasLimit?: string;
    gasUsed?: string;
    hash?: string;
    logsBloom?: string;
    nonce?: string;
    number?: number;
    parentHash?: string;
    receiptsRoot?: string;
    sha3Uncles?: string;
    size?: number;
    stateRoot?: string;
    timestamp?: number;
    transactionsRoot?: string;
    uncleReward?: string;
}

export type Buffer = any;
export type Date = any;
export type Decimal = any;
export type JSON = any;
