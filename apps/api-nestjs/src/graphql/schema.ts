/* tslint:disable */
export class Block {
    id?: Decimal;
    totalDifficulty?: string;
    header?: Header;
    uncles?: Uncle;
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
