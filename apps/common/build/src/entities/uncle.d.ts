/// <reference types="node" />
export interface Uncle {
    parentHash?: string;
    sha3Uncles?: string;
    uncleHeight?: number;
    blockHeight?: number;
    position?: number;
    hash?: string;
    timestamp?: number;
    nonce?: string;
    miner?: string;
    rewards?: any;
    difficulty?: number;
    totalDifficulty?: number;
    stateRoot?: Buffer;
    transactionsRoot?: Buffer;
    receiptsRoot?: Buffer;
    logsBloom?: Buffer;
    gasLimit?: number;
    gasUsed?: number;
    mixHash?: Buffer;
    extraData?: Buffer;
}
