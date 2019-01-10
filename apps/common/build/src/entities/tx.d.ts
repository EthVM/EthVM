/// <reference types="node" />
export interface Log {
    address: string;
    topics: Buffer[];
    data: Buffer;
}
export interface Trace {
    parentHash?: string;
    hash?: string;
    opcode?: string;
    deep?: number;
    index?: number;
    rejected?: boolean;
    from?: string;
    to?: string;
    value?: Buffer;
    data?: Buffer;
    gas?: number;
    gasPrice?: number;
    nonce?: Buffer;
}
export interface Tx {
    blockHash?: string;
    blockNumber?: number;
    hash?: string;
    timestamp?: number;
    index?: number;
    nonce?: string;
    from?: string;
    to?: string;
    contractAddress?: string;
    status?: boolean;
    data?: Buffer;
    fee?: number;
    logs?: Log;
    result?: boolean;
    gasPrice?: number;
    gasLimit?: number;
    gasUsed?: number;
    gasRefund?: number;
    gasLeftover?: number;
    traces?: Trace[];
    v?: number;
    r?: number;
    s?: number;
    value?: Buffer;
}
