/// <reference types="node" />
export interface Uncle {
    parentHash?: string;
    unclesHash?: string;
    timestamp?: number;
    nonce?: Buffer;
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
