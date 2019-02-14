/// <reference types="node" />
export interface Log {
    address: string;
    data: string;
    topics: string[];
}
export interface InternalTx {
    nonce: string;
    parentHash: string;
    blockHash: string;
    blockNumber: string;
    transactionIndex: number;
    internalTransactionIndex: number;
    from: string;
    to: string;
    value: string;
    gasPrice: string;
    gas: string;
    input: string;
    creates: string;
    depth: number;
    rejected: boolean;
}
export interface TxReceipt {
    blockHash: string;
    transactionHash: string;
    transactionIndex: number;
    cumulativeGasUsed: string;
    contractAddress: string;
    gasUsed: string;
    logs: Log[];
    logsBloom: string;
    status: string;
    error: string;
    internalTxs: InternalTx[];
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
