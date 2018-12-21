export class Block {
    number?: number;
    hash?: string;
    header?: Header;
    stats?: Stats;
    transactions?: string[];
    uncles?: string[];
}

export class Header {
    parentHash?: string;
    sha3Uncles?: string;
    hash?: string;
    number?: number;
    timestamp?: number;
    nonce?: string;
    miner?: string;
    mixHash?: JSON;
    rewards?: JSON;
    difficulty?: JSON;
    totalDifficulty?: JSON;
    stateRoot?: JSON;
    transactionsRoot?: JSON;
    receiptsRoot?: JSON;
    logsBloom?: JSON;
    gasLimit?: JSON;
    gasUsed?: JSON;
    extraData?: JSON;
}

export abstract class IQuery {
    abstract blocks(limit?: number, page?: number): Block[] | Promise<Block[]>;

    abstract block(hash?: string): Block | Promise<Block>;

    abstract temp__(): boolean | Promise<boolean>;
}

export class Stats {
    successfulTxs?: number;
    failedTxs?: number;
    pendingTxs?: number;
    processingTimeMs?: number;
    txs?: number;
    internalTxs?: number;
    totalGasPrice?: number;
    avgGasPrice?: number;
    totalTxsFees?: number;
    avgTxsFees?: number;
}

export type Date = any;
export type JSON = any;
