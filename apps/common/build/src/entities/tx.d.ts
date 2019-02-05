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
export interface TxReceipt {
    blockHash: string;
    transactionHash: string;
    transactionIndex: number;
    cumulativeGasUsed: string;
    contractAddress: string;
    gasUsed: string;
    logsBloom: string;
    status: string;
    error: string;
}
export interface Tx {
    hash: string;
    nonce: string;
    blockHash: string;
    blockNumber: string;
    transactionIndex: number;
    from: string;
    to: string;
    value: string;
    gasPrice: string;
    gas: string;
    input: string;
    v: Buffer;
    r: string;
    s: string;
    timestamp: number;
    receipt: TxReceipt;
}
