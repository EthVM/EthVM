/// <reference types="node" />
export interface Uncle {
    number: Buffer;
    hash: string;
    parentHash: string;
    nonce: string;
    sha3Uncles: string;
    logsBloom: string;
    transactionsRoot: string;
    stateRoot: string;
    receiptsRoot: string;
    author: string;
    difficulty: Buffer;
    extraData: string;
    gasLimit: Buffer;
    gasUsed: Buffer;
    timestamp: number;
}
