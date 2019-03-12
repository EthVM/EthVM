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
    uncles?: Uncle;
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

export abstract class ISubscription {
    abstract newBlock(): Block[] | Promise<Block[]>;
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
